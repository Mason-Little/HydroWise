import { formatPercent } from "./format";
import type { GradeTrackerPlan, GradeTrackerRow } from "./types";

export const getWeightStatus = (plan: GradeTrackerPlan): string | null => {
  if (plan.currentGradePct === null) return null;

  return `${plan.currentLetter ? `${plan.currentLetter} · ` : ""}${formatPercent(plan.currentGradePct)}`;
};

export const getTargetPlaceholder = (row: GradeTrackerRow): string => {
  if (row.locked || row.requiredRemainingAverage === null) return "Done";
  if (row.requiredRemainingAverage > 100) return ">100%";
  if (row.requiredRemainingAverage < 0) return "0%";

  return `~${Math.round(row.requiredRemainingAverage)}%`;
};

export const getRowRemainingLabel = (row: GradeTrackerRow): string | null => {
  if (row.locked || row.remainingCount === 0) return "Done";

  return row.remainingCount === 1 ? "1 left" : `${row.remainingCount} left`;
};

export const getRowEntryPercent = (row: GradeTrackerRow): number =>
  (row.enteredCount / row.assessmentCount) * 100;
