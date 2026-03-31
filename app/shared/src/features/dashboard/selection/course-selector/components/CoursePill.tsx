import type { Course } from "@hydrowise/entities";
import {
  courseTabSurfaceStyle,
  getCourseTheme,
} from "@/features/dashboard/selection/course-selector/courseTheme";
import { cn } from "@/lib/utils";

type CoursePillProps = {
  course: Course;
  isActive?: boolean;
  onClick?: () => void;
};

export const CoursePill = ({ course, isActive, onClick }: CoursePillProps) => {
  const theme = getCourseTheme(course.courseCode);
  const active = Boolean(isActive);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={courseTabSurfaceStyle(theme, active)}
      className={cn(
        "min-h-[72px] min-w-0 flex-1 rounded-t-xl rounded-b-none px-4 pb-[13px] pt-3.5 text-left transition-[background-color,color,border-color,box-shadow] duration-150 ease-out",
        active ? "relative z-[1] -mb-px" : "hover:brightness-[0.985]",
      )}
    >
      <p className="truncate text-sm font-semibold leading-tight tracking-tight">
        {course.courseCode}
      </p>
      <p
        className={cn(
          "mt-1 truncate text-[11px] font-medium leading-snug",
          active ? "opacity-[0.92]" : "opacity-80",
        )}
      >
        {course.courseName}
      </p>
    </button>
  );
};
