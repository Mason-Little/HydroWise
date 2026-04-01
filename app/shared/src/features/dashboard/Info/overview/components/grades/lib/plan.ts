import type {
  GradePlannerState,
  GradeRubricBucketKind,
  GradeRubricItem,
  GradeScaleItem,
} from "@hydrowise/entities";
import { clampPercent } from "./format";
import {
  getCurrentLetter,
  getGoalSelectorScale,
  getGoalTiles,
  getTargetGrade,
  sortGradeScale,
} from "./grade-scale";
import { getPlannerScores } from "./planner-state";
import type {
  GradeTrackerPlan,
  GradeTrackerStatus,
  PlannerBucket,
} from "./types";

type ComfortBand = {
  lowerDelta: number;
  upperDelta: number;
};

type ProjectionSet = {
  comfortHighProjection: number;
  comfortLowProjection: number;
  hardMaxProjection: number;
};

const COMFORT_BANDS: Record<GradeRubricBucketKind, ComfortBand> = {
  assignment: { lowerDelta: 6, upperDelta: 12 },
  exam: { lowerDelta: -5, upperDelta: 5 },
  final_exam: { lowerDelta: -8, upperDelta: 3 },
  lab: { lowerDelta: -1, upperDelta: 6 },
  midterm_exam: { lowerDelta: -5, upperDelta: 5 },
  other: { lowerDelta: 2, upperDelta: 8 },
  paper: { lowerDelta: 4, upperDelta: 10 },
  participation: { lowerDelta: 10, upperDelta: 15 },
  presentation: { lowerDelta: 4, upperDelta: 10 },
  project: { lowerDelta: 4, upperDelta: 10 },
  quiz: { lowerDelta: 1, upperDelta: 7 },
};

const BUCKET_SORT_ORDER: Record<GradeRubricBucketKind, number> = {
  participation: 0,
  assignment: 1,
  lab: 2,
  project: 3,
  paper: 4,
  presentation: 5,
  quiz: 6,
  midterm_exam: 7,
  exam: 8,
  other: 9,
  final_exam: 10,
};

const FINAL_BUCKET_PATTERN = /final/i;

const SEGMENT_FILLS = [
  "color-mix(in srgb, var(--accent-warm) 88%, white)",
  "color-mix(in srgb, var(--accent) 74%, var(--accent-warm))",
  "color-mix(in srgb, var(--gold) 72%, var(--accent-warm))",
  "color-mix(in srgb, var(--olive) 74%, var(--accent))",
  "color-mix(in srgb, var(--green) 62%, var(--accent))",
  "color-mix(in srgb, var(--green) 82%, white)",
] as const;

const averageScore = (scores: number[]): number | null => {
  if (scores.length === 0) return null;

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const getBucketKind = (item: GradeRubricItem): GradeRubricBucketKind => {
  if (FINAL_BUCKET_PATTERN.test(item.category)) {
    return "final_exam";
  }

  return item.bucketKind ?? "other";
};

const getBucketSortRank = (item: GradeRubricItem): number =>
  BUCKET_SORT_ORDER[getBucketKind(item)];

const getWeightPct = (rubric: GradeRubricItem[], weight: number): number => {
  const totalWeight = rubric.reduce((sum, item) => sum + item.weight, 0) || 1;
  return (weight / totalWeight) * 100;
};

const getAssessmentCount = (item: GradeRubricItem): number =>
  Math.max(item.assessmentCount ?? 1, 1);

const getRemainingCount = (
  assessmentCount: number,
  enteredCount: number,
): number => Math.max(assessmentCount - enteredCount, 0);

const getComfortAverage = (
  targetPct: number,
  bucketKind: GradeRubricBucketKind,
  bound: keyof ComfortBand,
): number => clampPercent(targetPct + COMFORT_BANDS[bucketKind][bound]);

const getHardMaxFinalAverage = (
  assessmentCount: number,
  enteredSum: number,
  remainingCount: number,
): number => (enteredSum + remainingCount * 100) / assessmentCount;

const getCurrentGradeProgress = (buckets: PlannerBucket[]) => {
  const progress = buckets.reduce(
    (totals, bucket) => {
      if (bucket.averagePct === null) return totals;

      return {
        earnedPoints:
          totals.earnedPoints + (bucket.weightPct * bucket.averagePct) / 100,
        enteredWeightPct: totals.enteredWeightPct + bucket.weightPct,
      };
    },
    { earnedPoints: 0, enteredWeightPct: 0 },
  );

  return {
    currentGradePct:
      progress.enteredWeightPct === 0
        ? null
        : (progress.earnedPoints / progress.enteredWeightPct) * 100,
    enteredWeightPct: progress.enteredWeightPct,
  };
};

const getWeightedPoints = (weightPct: number, pct: number): number =>
  (weightPct * pct) / 100;

const getLockedContribution = (buckets: PlannerBucket[]): number =>
  buckets.reduce((sum, bucket) => {
    if (!bucket.locked) return sum;

    return sum + getWeightedPoints(bucket.weightPct, bucket.averagePct ?? 0);
  }, 0);

const getProjectionSet = (
  buckets: PlannerBucket[],
  lockedContribution: number,
): ProjectionSet =>
  buckets.reduce<ProjectionSet>(
    (totals, bucket) => {
      if (bucket.locked) return totals;

      return {
        comfortHighProjection:
          totals.comfortHighProjection +
          getWeightedPoints(bucket.weightPct, bucket.comfortHighFinalAverage),
        comfortLowProjection:
          totals.comfortLowProjection +
          getWeightedPoints(bucket.weightPct, bucket.comfortLowFinalAverage),
        hardMaxProjection:
          totals.hardMaxProjection +
          getWeightedPoints(bucket.weightPct, bucket.hardMaxFinalAverage),
      };
    },
    {
      comfortHighProjection: lockedContribution,
      comfortLowProjection: lockedContribution,
      hardMaxProjection: lockedContribution,
    },
  );

const getNormalizedRatio = (
  value: number,
  floor: number,
  ceiling: number,
): number => {
  const range = ceiling - floor;
  if (range <= 0) {
    return value <= floor ? 0 : 1;
  }

  return clampPercent(((value - floor) / range) * 100) / 100;
};

const getPlannerStatus = (
  targetPct: number,
  projections: ProjectionSet,
  enteredWeightPct: number,
): GradeTrackerStatus => {
  if (enteredWeightPct === 0) return "idle";
  if (targetPct > projections.hardMaxProjection) return "impossible";
  if (targetPct <= projections.comfortLowProjection) return "comfortable";
  if (targetPct <= projections.comfortHighProjection) return "stretch";
  return "aggressive";
};

const interpolate = (from: number, to: number, ratio: number): number =>
  from + (to - from) * ratio;

const getSelectedFinalAverage = (
  bucket: PlannerBucket,
  projections: ProjectionSet,
  status: GradeTrackerStatus,
  targetPct: number,
): number => {
  if (bucket.locked) return bucket.averagePct ?? 0;

  if (status === "comfortable" || status === "stretch") {
    const lift = getNormalizedRatio(
      targetPct,
      projections.comfortLowProjection,
      projections.comfortHighProjection,
    );

    return interpolate(
      bucket.comfortLowFinalAverage,
      bucket.comfortHighFinalAverage,
      lift,
    );
  }

  if (status === "aggressive") {
    const push = getNormalizedRatio(
      targetPct,
      projections.comfortHighProjection,
      projections.hardMaxProjection,
    );

    return interpolate(
      bucket.comfortHighFinalAverage,
      bucket.hardMaxFinalAverage,
      push,
    );
  }

  return bucket.comfortLowFinalAverage;
};

const getRequiredRemainingAverage = (bucket: PlannerBucket): number | null => {
  if (bucket.locked || bucket.remainingCount === 0) return null;

  return (
    (bucket.selectedFinalAverage * bucket.assessmentCount - bucket.enteredSum) /
    bucket.remainingCount
  );
};

const toPlannerBucket = (
  rubric: GradeRubricItem[],
  item: GradeRubricItem,
  originalIndex: number,
  plannerState: GradePlannerState,
  targetPct: number,
  sortedIndex: number,
): PlannerBucket => {
  const rubricIndex = String(originalIndex);
  const scores = getPlannerScores(plannerState, rubricIndex);
  const assessmentCount = getAssessmentCount(item);
  const enteredCount = scores.length;
  const enteredSum = scores.reduce((sum, score) => sum + score, 0);
  const averagePct = averageScore(scores);
  const bucketKind = getBucketKind(item);
  const remainingCount = getRemainingCount(assessmentCount, enteredCount);

  return {
    assessmentCount,
    averagePct,
    bucketKind,
    category: item.category,
    comfortHighFinalAverage: getComfortAverage(
      targetPct,
      bucketKind,
      "upperDelta",
    ),
    comfortLowFinalAverage: getComfortAverage(
      targetPct,
      bucketKind,
      "lowerDelta",
    ),
    enteredCount,
    enteredSum,
    fill: SEGMENT_FILLS[sortedIndex % SEGMENT_FILLS.length],
    hardMaxFinalAverage: getHardMaxFinalAverage(
      assessmentCount,
      enteredSum,
      remainingCount,
    ),
    locked: remainingCount === 0,
    remainingCount,
    rubricIndex,
    selectedFinalAverage: averagePct ?? targetPct,
    weightPct: getWeightPct(rubric, item.weight),
  };
};

const withSelectedFinalAverages = (
  buckets: PlannerBucket[],
  projections: ProjectionSet,
  status: GradeTrackerStatus,
  targetPct: number,
): PlannerBucket[] =>
  buckets.map((bucket) => ({
    ...bucket,
    selectedFinalAverage: getSelectedFinalAverage(
      bucket,
      projections,
      status,
      targetPct,
    ),
  }));

export const getGradeTrackerPlan = (
  gradeRubric: GradeRubricItem[],
  gradeScale: GradeScaleItem[],
  plannerState: GradePlannerState,
): GradeTrackerPlan | null => {
  if (gradeRubric.length === 0 || gradeScale.length === 0) return null;

  const sortedScale = sortGradeScale(gradeScale);
  const selectorScale = getGoalSelectorScale(sortedScale);
  const tiles = getGoalTiles(selectorScale);
  const targetGrade = getTargetGrade(
    tiles,
    plannerState.selectedGoalLetter,
    sortedScale,
  );
  if (!targetGrade) return null;

  const buckets = [...gradeRubric]
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((left, right) => {
      const rankDifference =
        getBucketSortRank(left.item) - getBucketSortRank(right.item);

      return rankDifference || left.originalIndex - right.originalIndex;
    })
    .map(({ item, originalIndex }, sortedIndex) =>
      toPlannerBucket(
        gradeRubric,
        item,
        originalIndex,
        plannerState,
        targetGrade.min,
        sortedIndex,
      ),
    );

  const { currentGradePct, enteredWeightPct } =
    getCurrentGradeProgress(buckets);
  const lockedContribution = getLockedContribution(buckets);
  const projections = getProjectionSet(buckets, lockedContribution);
  const status = getPlannerStatus(
    targetGrade.min,
    projections,
    enteredWeightPct,
  );
  const solvedBuckets = withSelectedFinalAverages(
    buckets,
    projections,
    status,
    targetGrade.min,
  );

  const rows = solvedBuckets.map((bucket) => ({
    assessmentCount: bucket.assessmentCount,
    averagePct: bucket.averagePct,
    category: bucket.category,
    comfortHighFinalAverage: bucket.comfortHighFinalAverage,
    comfortLowFinalAverage: bucket.comfortLowFinalAverage,
    enteredCount: bucket.enteredCount,
    fill: bucket.fill,
    hardMaxFinalAverage: bucket.hardMaxFinalAverage,
    locked: bucket.locked,
    remainingCount: bucket.remainingCount,
    requiredRemainingAverage: getRequiredRemainingAverage(bucket),
    rubricIndex: bucket.rubricIndex,
    weightPct: bucket.weightPct,
  }));

  return {
    comfortHighProjection: projections.comfortHighProjection,
    comfortLowProjection: projections.comfortLowProjection,
    currentGradePct,
    currentLetter: getCurrentLetter(currentGradePct, sortedScale),
    hardMaxProjection: projections.hardMaxProjection,
    rows,
    status,
    targetGrade,
    tiles,
  };
};
