import { useEffect, useMemo } from "react";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { CoursePill } from "@/features/dashboard/selection/course-selector/components/CoursePill";
import { compareCoursesByThemeFamilyThenCode } from "@/features/dashboard/selection/course-selector/courseTheme";
import { useCourses } from "@/features/dashboard/selection/course-selector/hooks/useCourses";

export const CourseSelector = () => {
  const { activeCourse, setActiveCourseId } = useDashboardContext();
  const { courses, isLoading, isError } = useCourses();

  const sortedCourses = useMemo(
    () => [...courses].sort(compareCoursesByThemeFamilyThenCode),
    [courses],
  );

  useEffect(() => {
    if (courses.length > 0 && !activeCourse) {
      setActiveCourseId(courses[0].id);
    }
  }, [courses, activeCourse, setActiveCourseId]);

  if (isLoading)
    return <div className="text-muted-foreground">Loading courses…</div>;
  if (isError)
    return <div className="text-destructive">Failed to load courses.</div>;
  if (courses.length === 0)
    return <div className="text-muted-foreground">No courses yet.</div>;

  return (
    <div role="tablist" className="flex w-full min-w-0 gap-3">
      {sortedCourses.map((course) => (
        <CoursePill
          key={course.id}
          course={course}
          isActive={activeCourse?.id === course.id}
          onClick={() => setActiveCourseId(course.id)}
        />
      ))}
    </div>
  );
};
