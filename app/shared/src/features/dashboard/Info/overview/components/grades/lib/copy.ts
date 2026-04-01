import type { GradeTrackerRow } from "./types";

export const getGhostSuggestionScore = (
  row: GradeTrackerRow,
): number | null => {
  const planSlotsDone =
    row.remainingCount < 1 || row.enteredCount >= row.assessmentCount;
  if (planSlotsDone) {
    return null;
  }

  const r = row.requiredRemainingAverage;
  if (r === null || !Number.isFinite(r) || r > 100 || r < 0) {
    return null;
  }

  return Math.round(r);
};

export const getCategoryProgressLabel = (row: GradeTrackerRow): string => {
  if (row.locked || row.remainingCount === 0) return "Complete";

  return `${row.enteredCount} of ${row.assessmentCount}`;
};
