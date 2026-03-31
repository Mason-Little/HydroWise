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

type CourseTabPaint = {
  background: string;
  foreground: string;
  border: string;
};

export type CourseTheme = {
  familyId: CourseFamilyId;
  tab: CourseTabPaint;
  tabActive: CourseTabPaint;
  accent: {
    strong: string;
    soft: string;
    ring: string;
  };
  surfaceTint: string;
};

const FAMILIES: readonly CourseTheme[] = [
  {
    familyId: "sage",
    tab: {
      background: "#c5dcc0",
      foreground: "#2a3f33",
      border: "#b0c8b4",
    },
    tabActive: {
      background: "#aecfb0",
      foreground: "#1e3228",
      border: "#8aab92",
    },
    accent: {
      strong: "#3d5a48",
      soft: "#edf2ee",
      ring: "rgba(61, 90, 72, 0.22)",
    },
    surfaceTint: "#f4f7f5",
  },
  {
    familyId: "moss",
    tab: {
      background: "#cadecb",
      foreground: "#2a3a2e",
      border: "#b5c9b6",
    },
    tabActive: {
      background: "#b5d0b6",
      foreground: "#1e2e22",
      border: "#8aab8c",
    },
    accent: {
      strong: "#3d523e",
      soft: "#eef4ee",
      ring: "rgba(61, 82, 62, 0.22)",
    },
    surfaceTint: "#f5f7f4",
  },
  {
    familyId: "eucalyptus",
    tab: {
      background: "#c5ddd8",
      foreground: "#2a3d3a",
      border: "#aec9c4",
    },
    tabActive: {
      background: "#adcfc8",
      foreground: "#1e3330",
      border: "#7aab9f",
    },
    accent: {
      strong: "#355c55",
      soft: "#edf4f2",
      ring: "rgba(53, 92, 85, 0.22)",
    },
    surfaceTint: "#f3f7f6",
  },
  {
    familyId: "fog",
    tab: {
      background: "#cddfef",
      foreground: "#2a3540",
      border: "#b3cce3",
    },
    tabActive: {
      background: "#b4d0ea",
      foreground: "#1e2a38",
      border: "#7fa3c4",
    },
    accent: {
      strong: "#3a5568",
      soft: "#edf3f8",
      ring: "rgba(58, 85, 104, 0.22)",
    },
    surfaceTint: "#f3f6f9",
  },
  {
    familyId: "slate",
    tab: {
      background: "#d0d8e8",
      foreground: "#2e3340",
      border: "#bcc5d6",
    },
    tabActive: {
      background: "#b8c4dc",
      foreground: "#222836",
      border: "#8a96b4",
    },
    accent: {
      strong: "#3d4658",
      soft: "#eef1f6",
      ring: "rgba(61, 70, 88, 0.22)",
    },
    surfaceTint: "#f4f5f8",
  },
  {
    familyId: "lavender",
    tab: {
      background: "#ddd0ee",
      foreground: "#3a3248",
      border: "#ccc0dc",
    },
    tabActive: {
      background: "#cbb8e0",
      foreground: "#2e2840",
      border: "#9d8ab8",
    },
    accent: {
      strong: "#4a4260",
      soft: "#f2eef8",
      ring: "rgba(74, 66, 96, 0.22)",
    },
    surfaceTint: "#f6f4f9",
  },
  {
    familyId: "sand",
    tab: {
      background: "#ebe4d6",
      foreground: "#3f3a32",
      border: "#dcd3c4",
    },
    tabActive: {
      background: "#dfd3be",
      foreground: "#322d26",
      border: "#c4b49a",
    },
    accent: {
      strong: "#5a5246",
      soft: "#f5f1ea",
      ring: "rgba(90, 82, 70, 0.2)",
    },
    surfaceTint: "#f8f6f2",
  },
  {
    familyId: "rose",
    tab: {
      background: "#ead8d5",
      foreground: "#403438",
      border: "#dbc8c4",
    },
    tabActive: {
      background: "#dcc4c0",
      foreground: "#362a2e",
      border: "#c0a39e",
    },
    accent: {
      strong: "#5c4548",
      soft: "#f6f0ef",
      ring: "rgba(92, 69, 72, 0.2)",
    },
    surfaceTint: "#f8f5f4",
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
  return FAMILIES.at(i) ?? FAMILIES[0];
};

const COURSE_TAB_BORDER_BOTTOM = "transparent";
const COURSE_TAB_SHADOW_INACTIVE = "0 1px 2px rgba(37, 50, 58, 0.06)";
const COURSE_TAB_SHADOW_ACTIVE = "inset 0 1px 0 rgba(255, 255, 255, 0.5)";

export const courseTabSurfaceStyle = (
  theme: CourseTheme,
  isActive: boolean,
): CSSProperties => {
  const tab = isActive ? theme.tabActive : theme.tab;
  return {
    backgroundColor: tab.background,
    color: tab.foreground,
    border: `1px solid ${tab.border}`,
    borderBottomColor: COURSE_TAB_BORDER_BOTTOM,
    boxShadow: isActive ? COURSE_TAB_SHADOW_ACTIVE : COURSE_TAB_SHADOW_INACTIVE,
  };
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

export const courseThemeWorkspaceStyle = (
  theme: CourseTheme,
): CSSProperties => {
  return {
    "--course-accent-strong": theme.accent.strong,
    "--course-accent-soft": theme.accent.soft,
    "--course-accent-ring": theme.accent.ring,
    "--course-surface-tint": theme.surfaceTint,
  } as CSSProperties;
};
