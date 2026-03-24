import { useEffect } from "react";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { useCourses } from "./hooks/useCourses";

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
    <ul className="space-y-1">
      {courses.map((course) => (
        <li key={course.id}>
          <button
            type="button"
            onClick={() => setActiveCourse(course)}
            className={
              activeCourse?.id === course.id
                ? "w-full text-left text-sm font-medium"
                : "w-full text-left text-sm text-muted-foreground hover:text-foreground"
            }
          >
            {course.courseCode} — {course.courseName}
          </button>
        </li>
      ))}
    </ul>
  );
};
