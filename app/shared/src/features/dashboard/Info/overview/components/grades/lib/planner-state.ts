import type { GradePlannerState } from "@hydrowise/entities";
import type { PlannerCourseRow } from "./types";

const getScoresByRubricIndex = (
  plannerState: GradePlannerState,
): Record<string, number[]> => plannerState.scoresByRubricIndex ?? {};

export const getPlannerScores = (
  plannerState: GradePlannerState,
  rubricIndex: string,
): number[] => getScoresByRubricIndex(plannerState)[rubricIndex] ?? [];

export const addPlannerScore = (
  plannerState: GradePlannerState,
  rubricIndex: string,
  score: number,
): GradePlannerState => ({
  ...plannerState,
  scoresByRubricIndex: {
    ...getScoresByRubricIndex(plannerState),
    [rubricIndex]: [...getPlannerScores(plannerState, rubricIndex), score],
  },
});

export const removePlannerScore = (
  plannerState: GradePlannerState,
  rubricIndex: string,
  scoreIndex: number,
): GradePlannerState => {
  const scoresByRubricIndex = getScoresByRubricIndex(plannerState);
  const nextScores = getPlannerScores(plannerState, rubricIndex).filter(
    (_score, index) => index !== scoreIndex,
  );

  if (nextScores.length > 0) {
    return {
      ...plannerState,
      scoresByRubricIndex: {
        ...scoresByRubricIndex,
        [rubricIndex]: nextScores,
      },
    };
  }

  const { [rubricIndex]: _removed, ...nextScoresByRubricIndex } =
    scoresByRubricIndex;

  return {
    ...plannerState,
    scoresByRubricIndex: nextScoresByRubricIndex,
  };
};

export const setPlannerTargetLetter = (
  plannerState: GradePlannerState,
  selectedGoalLetter: string,
): GradePlannerState => ({
  ...plannerState,
  selectedGoalLetter,
});

export const replaceCoursePlannerState = <Course extends PlannerCourseRow>(
  courses: Course[],
  courseId: string,
  plannerState: GradePlannerState,
): Course[] =>
  courses.map((course) =>
    course.id === courseId
      ? { ...course, gradePlannerState: plannerState }
      : course,
  );
