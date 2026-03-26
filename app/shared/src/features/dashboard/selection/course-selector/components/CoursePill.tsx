import type { Course } from "@hydrowise/entities";
import { cn } from "@/lib/utils";
import { useCourseColor } from "../hooks/useCourseColor";

type CoursePillProps = {
  course: Course;
  isActive?: boolean;
  onClick?: () => void;
};

export const CoursePill = ({ course, isActive, onClick }: CoursePillProps) => {
  const colors = useCourseColor(course.courseCode);
  return (
    <button
      type="button"
      onClick={onClick}
      style={isActive ? colors.active : colors.inactive}
      className={cn(
        "min-w-0 flex-1 rounded-lg px-3.5 py-2.5 text-left transition-colors hover:brightness-95",
        isActive && "text-white",
      )}
    >
      <p className="truncate text-xs font-semibold leading-tight">
        {course.courseCode}
      </p>
      <p className="mt-0.5 hidden truncate text-xs opacity-70 sm:block">
        {course.courseName}
      </p>
    </button>
  );
};
