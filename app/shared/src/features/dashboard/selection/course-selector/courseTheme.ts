import type { CSSProperties } from "react";

export type CourseFamilyId =
  | "sage"
  | "moss"
  | "eucalyptus"
  | "fog"
  | "slate"
  | "lavender"
  | "sand"
  | "rose";

/** One visual state of a course tab (inactive, active, or hover). */
export type CourseTabPaint = {
  background: string;
  foreground: string;
  border: string;
};

export type CourseTheme = {
  familyId: CourseFamilyId;
  /** Unselected tab: softened pastel blended into the neutral shell */
  tabInactive: CourseTabPaint;
  /** Selected tab: clearer identity, still pastel — not a saturated badge */
  tabActive: CourseTabPaint;
  /** Optional hover overlay for inactive tabs (theme-level paint only) */
  tabInactiveHover?: Partial<Pick<CourseTabPaint, "background">>;
  accent: {
    strong: string;
    soft: string;
    ring: string;
  };
  /** Very light wash for workspace gradients */
  surfaceTint: string;
  /** Course-aware rail background (mostly neutral + whisper of identity) */
  railWash: string;
};

const RAIL_NEUTRAL_STACK =
  "linear-gradient(180deg, #fdfdfc 0%, #ecebe9 40%, #f5f4f2 100%)";

/** Mostly neutral rail; course identity is a very light wash (no strong diagonal bleed). */
const railWashFromPastel = (pastel: string): string =>
  `linear-gradient(108deg, color-mix(in srgb, ${pastel} 5%, transparent) 0%, transparent 42%), ${RAIL_NEUTRAL_STACK}`;

const FAMILIES: readonly CourseTheme[] = [
  {
    familyId: "sage",
    tabInactive: {
      background: "color-mix(in srgb, #c5dcc0 72%, #f5f4f2)",
      foreground: "#4e5c56",
      border: "color-mix(in srgb, #c5dcc0 38%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #c5dcc0 78%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #c5dcc0 90%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #5f766a 26%, #e8e7e4)",
    },
    accent: {
      strong: "#33443c",
      soft: "#edf2ee",
      ring: "rgba(51, 68, 60, 0.22)",
    },
    surfaceTint: "#f2f5f3",
    railWash: railWashFromPastel("#c5dcc0"),
  },
  {
    familyId: "moss",
    tabInactive: {
      background: "color-mix(in srgb, #cadecb 72%, #f5f4f2)",
      foreground: "#4d5a50",
      border: "color-mix(in srgb, #cadecb 38%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #cadecb 78%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #cadecb 90%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #5f766a 24%, #e8e7e4)",
    },
    accent: {
      strong: "#33443c",
      soft: "#edf2ee",
      ring: "rgba(55, 72, 58, 0.2)",
    },
    surfaceTint: "#f3f5f3",
    railWash: railWashFromPastel("#cadecb"),
  },
  {
    familyId: "eucalyptus",
    tabInactive: {
      background: "color-mix(in srgb, #c5ddd8 72%, #f5f4f2)",
      foreground: "#4d5a58",
      border: "color-mix(in srgb, #c5ddd8 38%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #c5ddd8 78%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #c5ddd8 90%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #5f7a72 22%, #e8e7e4)",
    },
    accent: {
      strong: "#355c55",
      soft: "#edf4f2",
      ring: "rgba(53, 92, 85, 0.2)",
    },
    surfaceTint: "#f2f6f5",
    railWash: railWashFromPastel("#c5ddd8"),
  },
  {
    familyId: "fog",
    tabInactive: {
      background: "color-mix(in srgb, #cddfef 70%, #f5f4f2)",
      foreground: "#4f5a62",
      border: "color-mix(in srgb, #cddfef 36%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #cddfef 76%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #cddfef 88%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #6a8aad 20%, #e8e7e4)",
    },
    accent: {
      strong: "#3a5568",
      soft: "#edf3f8",
      ring: "rgba(58, 85, 104, 0.2)",
    },
    surfaceTint: "#f3f6f8",
    railWash: railWashFromPastel("#cddfef"),
  },
  {
    familyId: "slate",
    tabInactive: {
      background: "color-mix(in srgb, #d0d8e8 72%, #f5f4f2)",
      foreground: "#505660",
      border: "color-mix(in srgb, #d0d8e8 38%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #d0d8e8 78%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #d0d8e8 90%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #6a7a94 22%, #e8e7e4)",
    },
    accent: {
      strong: "#3d4658",
      soft: "#eef1f6",
      ring: "rgba(61, 70, 88, 0.2)",
    },
    surfaceTint: "#f4f5f7",
    railWash: railWashFromPastel("#d0d8e8"),
  },
  {
    familyId: "lavender",
    tabInactive: {
      background: "color-mix(in srgb, #ddd0ee 70%, #f5f4f2)",
      foreground: "#56525f",
      border: "color-mix(in srgb, #ddd0ee 36%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #ddd0ee 76%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #ddd0ee 88%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #8f82a8 18%, #e8e7e4)",
    },
    accent: {
      strong: "#4a4260",
      soft: "#f2eef8",
      ring: "rgba(74, 66, 96, 0.2)",
    },
    surfaceTint: "#f5f3f8",
    railWash: railWashFromPastel("#ddd0ee"),
  },
  {
    familyId: "sand",
    tabInactive: {
      background: "color-mix(in srgb, #ebe4d6 74%, #f5f4f2)",
      foreground: "#5c574f",
      border: "color-mix(in srgb, #ebe4d6 40%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #ebe4d6 80%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #ebe4d6 92%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #9a8f7a 22%, #e8e7e4)",
    },
    accent: {
      strong: "#5a5246",
      soft: "#f5f1ea",
      ring: "rgba(90, 82, 70, 0.2)",
    },
    surfaceTint: "#f7f5f1",
    railWash: railWashFromPastel("#ebe4d6"),
  },
  {
    familyId: "rose",
    tabInactive: {
      background: "color-mix(in srgb, #ead8d5 74%, #f5f4f2)",
      foreground: "#5d5355",
      border: "color-mix(in srgb, #ead8d5 40%, #e8e7e4)",
    },
    tabInactiveHover: {
      background: "color-mix(in srgb, #ead8d5 80%, #f2f1ef)",
    },
    tabActive: {
      background: "color-mix(in srgb, #ead8d5 92%, #f9f8f6)",
      foreground: "#25323a",
      border: "color-mix(in srgb, #a88f8c 20%, #e8e7e4)",
    },
    accent: {
      strong: "#5c4548",
      soft: "#f6f0ef",
      ring: "rgba(92, 69, 72, 0.2)",
    },
    surfaceTint: "#f7f4f3",
    railWash: railWashFromPastel("#ead8d5"),
  },
];

export const COURSE_THEME_FAMILY_ORDER: readonly CourseFamilyId[] =
  FAMILIES.map((f) => f.familyId);

const FAMILY_ORDER_INDEX = Object.fromEntries(
  COURSE_THEME_FAMILY_ORDER.map((id, i) => [id, i]),
) as Record<CourseFamilyId, number>;

export const hashCourseCode = (code: string): number => {
  const s = code.trim() || "COURSE";
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export const getCourseTheme = (courseCode: string): CourseTheme => {
  const i = hashCourseCode(courseCode.toUpperCase()) % FAMILIES.length;
  return FAMILIES[i] ?? FAMILIES[0];
};

/** Opaque-enough outline so semi-transparent borders don’t fringe white at corners. */
const tabHairlineShadow = (borderColor: string) =>
  `0 0 0 1px color-mix(in srgb, ${borderColor} 26%, #e8e7e4)`;

/** Inactive tab paint: base/hover backgrounds live in CSS (vars) for smooth hover without React state. */
export const courseTabSurfaceStyle = (
  theme: CourseTheme,
  isActive: boolean,
): CSSProperties => {
  const tab = isActive ? theme.tabActive : theme.tabInactive;
  const hoverBg =
    theme.tabInactiveHover?.background ?? theme.tabInactive.background;

  if (isActive) {
    return {
      backgroundColor: tab.background,
      color: tab.foreground,
      border: `1px solid ${tab.border}`,
      borderBottomColor: "transparent",
      /* 1px “foot” same as fill to kill hairline gaps above canvas — no inset top highlight (reads as a seam on light fills). */
      boxShadow: `0 1px 0 0 ${tab.background}`,
    };
  }

  /* Soft hairline + very light depth; hover bumps shadow slightly in CSS (no inset sheen). */
  const shadowIdle = `${tabHairlineShadow(tab.border)}, 0 2px 8px rgba(37, 50, 58, 0.014)`;
  const shadowHover = `${tabHairlineShadow(tab.border)}, 0 3px 10px rgba(37, 50, 58, 0.019)`;

  return {
    color: tab.foreground,
    border: "1px solid transparent",
    borderBottomColor: "transparent",
    "--course-tab-base-bg": tab.background,
    "--course-tab-hover-bg": hoverBg,
    "--course-tab-shadow-idle": shadowIdle,
    "--course-tab-shadow-hover": shadowHover,
  } as CSSProperties;
};

export const courseTabSubtitleColor = (
  theme: CourseTheme,
  isActive: boolean,
): string => {
  if (isActive) {
    return `color-mix(in srgb, ${theme.tabActive.foreground} 70%, ${theme.tabActive.background})`;
  }
  return `color-mix(in srgb, ${theme.tabInactive.foreground} 86%, ${theme.tabInactive.background})`;
};

export const compareCoursesByThemeFamilyThenCode = (
  a: { courseCode: string },
  b: { courseCode: string },
): number => {
  const ia = FAMILY_ORDER_INDEX[getCourseTheme(a.courseCode).familyId];
  const ib = FAMILY_ORDER_INDEX[getCourseTheme(b.courseCode).familyId];
  if (ia !== ib) return ia - ib;
  return a.courseCode.localeCompare(b.courseCode, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

export const courseThemeWorkspaceStyle = (theme: CourseTheme): CSSProperties =>
  ({
    "--course-accent-strong": theme.accent.strong,
    "--course-accent-soft": theme.accent.soft,
    "--course-accent-ring": theme.accent.ring,
    "--course-surface-tint": theme.surfaceTint,
    "--course-rail-wash": theme.railWash,
  }) as CSSProperties;
