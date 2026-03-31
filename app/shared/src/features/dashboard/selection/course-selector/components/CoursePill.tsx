import type { Course } from "@hydrowise/entities";
import {
  courseTabSubtitleColor,
  courseTabSurfaceStyle,
  getCourseTheme,
} from "@/features/dashboard/selection/course-selector/courseTheme";
import { cn } from "@/lib/utils";

/* Active tab: no motion (seated). Inactive: slight hover lift; :active cancels lift so clicks are not springy. */
const ACTIVE_TAB_CLASS = "relative z-[1] -mb-px cursor-default transition-none";
const INACTIVE_TAB_CLASS =
  "cursor-pointer transition-transform duration-100 ease-out motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-px active:translate-y-0";

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
      style={{
        ...courseTabSurfaceStyle(theme, active),
        borderTopLeftRadius: "var(--app-radius-tab-top, 12px)",
        borderTopRightRadius: "var(--app-radius-tab-top, 12px)",
      }}
      className={cn(
        "app-course-tab min-h-[72px] min-w-0 flex-1 rounded-b-none px-4 pb-[13px] pt-3.5 text-left [-webkit-tap-highlight-color:transparent] touch-manipulation",
        active ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS,
      )}
    >
      <p className="truncate text-sm font-semibold leading-tight tracking-tight">
        {course.courseCode}
      </p>
      <p
        className={cn(
          "mt-1 truncate text-[11px] font-medium leading-snug",
          active ? "opacity-[0.96]" : "opacity-[0.98]",
        )}
        style={{ color: courseTabSubtitleColor(theme, active) }}
      >
        {course.courseName}
      </p>
    </button>
  );
};
