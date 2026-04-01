import type { Course } from "@hydrowise/entities";
import { courseTabCssVariables } from "@/features/dashboard/selection/course-selector/courseTheme";

type CoursePillProps = {
  course: Course;
  isActive?: boolean;
  onClick?: () => void;
};

export const CoursePill = ({ course, isActive, onClick }: CoursePillProps) => {
  const active = Boolean(isActive);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={courseTabCssVariables(course.courseCode)}
      className="app-course-tab touch-manipulation text-left [-webkit-tap-highlight-color:transparent]"
    >
      <span className="app-course-tab__code">{course.courseCode}</span>
      <span className="app-course-tab__name">{course.courseName}</span>
    </button>
  );
};
