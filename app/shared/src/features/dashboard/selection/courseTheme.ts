import type { CSSProperties } from "react";

/** Curated pastel families + micro drift — ported from design/Dashboard.html */
type PastelFamily = {
  h: number;
  bgS: number;
  bgL: number;
  fgS: number;
  fgL: number;
};

const PASTEL_FAMILIES: readonly PastelFamily[] = [
  { h: 154, bgS: 48, bgL: 87.5, fgS: 29, fgL: 27 },
  { h: 138, bgS: 45, bgL: 87.5, fgS: 28, fgL: 26 },
  { h: 275, bgS: 42, bgL: 89.5, fgS: 25, fgL: 31 },
  { h: 208, bgS: 46, bgL: 88.5, fgS: 27, fgL: 28 },
  { h: 26, bgS: 54, bgL: 89.5, fgS: 30, fgL: 30 },
  { h: 46, bgS: 56, bgL: 89.5, fgS: 30, fgL: 28 },
];

const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n));

export const hashCourseCode = (code: string): number => {
  const s = code.trim() || "COURSE";
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export type CourseProceduralPaint = {
  bg: string;
  fg: string;
  border: string;
  activeBg: string;
  activeFg: string;
  activeBorder: string;
  h: number;
  bgS: number;
  bgL: number;
};

/** Deterministic HSL tab + rail paint from course code (HTML mock parity). */
export const coursePaintFromCode = (rawCode: string): CourseProceduralPaint => {
  const code = rawCode.trim().toUpperCase() || "COURSE";
  const hash = hashCourseCode(code);
  const f = PASTEL_FAMILIES[hash % PASTEL_FAMILIES.length];
  const dH = (((hash >> 5) % 5) - 2) * 1.0;
  const dS = (((hash >> 9) % 5) - 2) * 0.4;
  const dL = (((hash >> 13) % 5) - 2) * 0.35;
  const hue = f.h + dH;
  const bgS = clamp(f.bgS + dS, 38, 58);
  const bgL = clamp(f.bgL + dL, 84, 90.5);
  const fgH = f.h + dH * 0.5;
  const fgS = clamp(f.fgS + dS * 0.45, 22, 36);
  const fgL = clamp(f.fgL + dL * 0.45, 22, 36);
  const bg = `hsl(${hue} ${bgS}% ${bgL}%)`;
  const fg = `hsl(${fgH} ${fgS}% ${fgL}%)`;
  const border = `hsl(${hue} ${clamp(bgS + 8, 34, 52)}% ${clamp(bgL - 22, 58, 74)}%)`;
  const activeBg = `hsl(${hue} ${clamp(bgS + 10, 32, 50)}% ${clamp(bgL - 7.5, 78, 87)}%)`;
  const activeFg = `hsl(${fgH} ${clamp(fgS + 5, 22, 36)}% ${clamp(fgL - 3.5, 20, 32)}%)`;
  const activeBorder = `hsl(${hue} ${clamp(bgS + 12, 34, 48)}% ${clamp(bgL - 30, 46, 62)}%)`;
  return {
    bg,
    fg,
    border,
    activeBg,
    activeFg,
    activeBorder,
    h: hue,
    bgS,
    bgL,
  };
};

/** Per-tab custom properties consumed by `index.css` (`.app-course-tab`). */
export const courseTabCssVariables = (courseCode: string): CSSProperties => {
  const v = coursePaintFromCode(courseCode);
  return {
    "--course-pill-bg": v.bg,
    "--course-pill-fg": v.fg,
    "--course-pill-border": v.border,
    "--course-pill-active-bg": v.activeBg,
    "--course-pill-active-fg": v.activeFg,
    "--course-pill-active-border": v.activeBorder,
  } as CSSProperties;
};

/** Multi-stop wash behind the course rail tabs (mock `applyProceduralCourseColors`). */
export const buildCourseRailWash = (codes: readonly string[]): string => {
  const base = "linear-gradient(180deg, #fdfdfc 0%, #ecebe9 40%, #f5f4f2 100%)";
  const n = codes.length;
  if (n === 0) return base;
  const hueStops: string[] = [];
  for (let i = 0; i < n; i++) {
    const v = coursePaintFromCode(codes[i] ?? "");
    const pos = n <= 1 ? 50 : (i / (n - 1)) * 100;
    const s = clamp(Math.round(v.bgS * 0.62 + 4), 28, 42);
    const l = clamp(v.bgL + 0.8, 86, 90);
    hueStops.push(`hsl(${v.h} ${s}% ${l}%) ${pos}%`);
  }
  return `linear-gradient(96deg, ${hueStops.join(", ")}), ${base}`;
};

/**
 * Course-aware workspace tint + accents on `.app-workspace-shell` (wash layer + accents).
 * Recomputes wash tokens so `--app-workspace-wash-a` matches the active course.
 */
export const courseWorkspaceCssVariables = (
  courseCode: string,
): CSSProperties => {
  const v = coursePaintFromCode(courseCode);
  const surfaceTint = `hsl(${v.h} ${clamp(v.bgS * 0.35, 14, 32)}% 96%)`;
  const accentSoft = `color-mix(in srgb, ${v.activeBg} 28%, var(--app-surface-primary))`;
  return {
    "--course-surface-tint": surfaceTint,
    "--app-workspace-wash-a": `color-mix(in srgb, ${surfaceTint} 11%, var(--app-workspace-bg))`,
    "--course-accent-strong": v.activeFg,
    "--course-accent-soft": accentSoft,
    "--course-accent-ring": `color-mix(in srgb, ${v.border} 35%, transparent)`,
  } as CSSProperties;
};

export const compareCoursesByCode = (
  a: { courseCode: string },
  b: { courseCode: string },
): number =>
  a.courseCode.localeCompare(b.courseCode, undefined, {
    numeric: true,
    sensitivity: "base",
  });
