import type { GradeScaleItem } from "@hydrowise/entities";
import type { GoalGradeTile } from "./types";

/** Letters hidden from the goal picker (exact match after trim). */
const EXCLUDED_GOAL_LETTERS = new Set(["F", "D"]);

const GRADE_RANK: Record<string, number> = {
  F: 0,
  D: 1,
  C: 2,
  B: 3,
  A: 4,
};

const getLetterRank = (letter: string): number =>
  GRADE_RANK[letter.trim().charAt(0).toUpperCase()] ?? -1;

/**
 * Pastel fill along the scale: lowest threshold → soft red/coral, highest → soft green.
 * Sweeps hue through yellow (warm middle) — no purple at the top.
 */
const getGoalTileFill = (index: number, count: number): string => {
  if (count <= 0) return "hsl(130, 50%, 88%)";
  const t = count <= 1 ? 1 : index / (count - 1);
  const hue = 6 + t * 128;
  const sat = 50 + Math.sin(t * Math.PI) * 16;
  const light = 90 - t * 2.5;
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
};

export const sortGradeScale = (
  gradeScale: GradeScaleItem[],
): GradeScaleItem[] =>
  [...gradeScale].sort((left, right) => {
    const thresholdDifference = left.min - right.min;
    if (thresholdDifference !== 0) return thresholdDifference;

    return getLetterRank(left.letter) - getLetterRank(right.letter);
  });

/**
 * Scale rows shown in the goal selector. Falls back to the full sorted scale
 * if filtering would remove every row.
 */
export const getGoalSelectorScale = (
  sortedScale: GradeScaleItem[],
): GradeScaleItem[] => {
  const filtered = sortedScale.filter(
    (item) => !EXCLUDED_GOAL_LETTERS.has(item.letter.trim()),
  );
  return filtered.length > 0 ? filtered : sortedScale;
};

export const getGoalTiles = (gradeScale: GradeScaleItem[]): GoalGradeTile[] =>
  gradeScale.map((item, index) => ({
    ...item,
    backgroundColor: getGoalTileFill(index, gradeScale.length),
  }));

export const getTargetGrade = (
  tiles: GoalGradeTile[],
  selectedLetter: string | null,
  fullSortedScale: GradeScaleItem[],
): GoalGradeTile | null => {
  if (tiles.length === 0) return null;

  if (selectedLetter === null) {
    return tiles.at(-1) ?? null;
  }

  const direct = tiles.find((item) => item.letter === selectedLetter);
  if (direct) return direct;

  const saved = fullSortedScale.find((g) => g.letter === selectedLetter);
  const savedMin = saved?.min ?? 0;

  const upward = tiles.find((t) => t.min >= savedMin);
  return upward ?? tiles.at(-1) ?? null;
};

export const getCurrentLetter = (
  currentGradePct: number | null,
  sortedScale: GradeScaleItem[],
): string | null => {
  if (currentGradePct === null) return null;

  return sortedScale.reduceRight<string | null>(
    (bestMatch, grade) =>
      bestMatch ?? (currentGradePct >= grade.min ? grade.letter : null),
    null,
  );
};
