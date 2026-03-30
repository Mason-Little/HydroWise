import type { Course } from "@hydrowise/entities";
import type { CSSProperties } from "react";
import {
  type CourseTheme,
  getCourseTheme,
} from "@/features/dashboard/selection/course-selector/courseTheme";
import { cn } from "@/lib/utils";

type CoursePillProps = {
  course: Course;
  isActive?: boolean;
  onClick?: () => void;
};

const coursePillStyle = (
  theme: CourseTheme,
  isActive: boolean,
): CSSProperties => {
  const tab = isActive ? theme.tabActive : theme.tab;
  return {
    backgroundColor: tab.background,
    color: tab.foreground,
    border: `1px solid ${tab.border}`,
    boxShadow: isActive
      ? "inset 0 1px 0 rgba(255, 255, 255, 0.5)"
      : "0 1px 2px rgba(37, 50, 58, 0.06)",
  };
};

export const CoursePill = ({ course, isActive, onClick }: CoursePillProps) => {
  const theme = getCourseTheme(course.courseCode);

  return (
    <button
      type="button"
      onClick={onClick}
      style={coursePillStyle(theme, Boolean(isActive))}
      className={cn(
        "min-w-0 flex-1 rounded-t-[11px] rounded-b-md px-3.5 py-2.5 text-left transition-[background-color,color,border-color,box-shadow] duration-150 ease-out",
        !isActive && "hover:brightness-[0.985]",
      )}
    >
      <p className="truncate text-xs font-semibold leading-tight tracking-tight">
        {course.courseCode}
      </p>
      <p
        className={cn(
          "mt-0.5 hidden truncate text-[11px] font-medium leading-snug sm:block",
          isActive ? "opacity-[0.92]" : "opacity-80",
        )}
      >
        {course.courseName}
      </p>
    </button>
  );
};
