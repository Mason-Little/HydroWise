import { type CSSProperties, useEffect, useMemo } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { CoursePill } from "@/features/dashboard/selection/components/CoursePill";
import {
  buildCourseRailWash,
  compareCoursesByCode,
} from "@/features/dashboard/selection/courseTheme";
import { useCourses } from "@/features/dashboard/selection/hooks/useCourses";

export const CourseSelector = () => {
  const { activeCourse, setActiveCourseId } = useDashboardContext();
  const { courses, isLoading, isError } = useCourses();

  const { sortedCourses, railStyle } = useMemo(() => {
    const sorted = [...courses].sort(compareCoursesByCode);
    const railStyle: CSSProperties = {
      background: buildCourseRailWash(sorted.map((c) => c.courseCode)),
    };
    return { sortedCourses: sorted, railStyle };
  }, [courses]);

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
    <nav className="app-course-rail" aria-label="Courses" style={railStyle}>
      <div role="tablist" className="app-course-rail__tablist">
        {sortedCourses.map((course) => (
          <CoursePill
            key={course.id}
            course={course}
            isActive={activeCourse?.id === course.id}
            onClick={() => setActiveCourseId(course.id)}
          />
        ))}
      </div>
    </nav>
  );
};
