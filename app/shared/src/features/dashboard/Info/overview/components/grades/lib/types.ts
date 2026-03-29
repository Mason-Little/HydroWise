import type {
  GradePlannerState,
  GradeRubricBucketKind,
  GradeScaleItem,
} from "@hydrowise/entities";

export type GoalGradeTile = GradeScaleItem & {
  backgroundColor: string;
};

export type GradeTrackerStatus =
  | "idle"
  | "comfortable"
  | "stretch"
  | "aggressive"
  | "impossible";

export type GradeTrackerRow = {
  assessmentCount: number;
  averagePct: number | null;
  category: string;
  comfortHighFinalAverage: number;
  comfortLowFinalAverage: number;
  enteredCount: number;
  fill: string;
  hardMaxFinalAverage: number;
  locked: boolean;
  remainingCount: number;
  requiredRemainingAverage: number | null;
  rubricIndex: string;
  weightPct: number;
};

export type GradeTrackerPlan = {
  comfortHighProjection: number;
  comfortLowProjection: number;
  currentGradePct: number | null;
  currentLetter: string | null;
  hardMaxProjection: number;
  rows: GradeTrackerRow[];
  status: GradeTrackerStatus;
  targetGrade: GoalGradeTile;
  tiles: GoalGradeTile[];
};

export type PlannerCourseRow = {
  gradePlannerState: GradePlannerState;
  id: string;
};

export type PlannerBucket = {
  assessmentCount: number;
  averagePct: number | null;
  category: string;
  comfortHighFinalAverage: number;
  comfortLowFinalAverage: number;
  enteredCount: number;
  enteredSum: number;
  fill: string;
  hardMaxFinalAverage: number;
  locked: boolean;
  remainingCount: number;
  rubricIndex: string;
  selectedFinalAverage: number;
  weightPct: number;
  bucketKind: GradeRubricBucketKind;
};
