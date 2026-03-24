import { useEffect } from "react";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { CoursePill } from "@/features/dashboard/selection/course-selector/components/CoursePill";
import { useCourses } from "@/features/dashboard/selection/course-selector/hooks/useCourses";

export const CourseSelector = () => {
  const { activeCourse, setActiveCourse } = useDashboardContext();
  const { courses, isLoading, isError } = useCourses();

  useEffect(() => {
    if (courses.length > 0 && !activeCourse) {
      setActiveCourse(courses[0]);
    }
  }, [courses, activeCourse, setActiveCourse]);

  if (isLoading)
    return <div className="text-muted-foreground">Loading courses…</div>;
  if (isError)
    return <div className="text-destructive">Failed to load courses.</div>;
  if (courses.length === 0)
    return <div className="text-muted-foreground">No courses yet.</div>;

  return (
    <div className="flex w-full gap-2">
      {courses.map((course) => (
        <CoursePill
          key={course.id}
          course={course}
          isActive={activeCourse?.id === course.id}
          onClick={() => setActiveCourse(course)}
        />
      ))}
    </div>
  );
};
