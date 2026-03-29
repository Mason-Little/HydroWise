export const clampPercent = (value: number): number =>
  Math.min(100, Math.max(0, value));

export const formatPercent = (value: number): string =>
  value % 1 === 0 ? `${Math.round(value)}%` : `${value.toFixed(1)}%`;

export const formatScore = (value: number): string =>
  value % 1 === 0 ? String(Math.round(value)) : value.toFixed(1);

export const formatCoursePoints = (value: number): string =>
  value % 1 === 0 ? `${Math.round(value)}` : value.toFixed(1);

export const normalizeScoreInput = (draft: string): number | null => {
  const trimmed = draft.trim();
  if (trimmed === "") return null;

  const score = Number.parseFloat(trimmed);
  if (!Number.isFinite(score)) return null;

  return clampPercent(score);
};
