import { useEffect } from "react";
import { useCourses } from "@/hooks/query/course.queries";
import { useCourseStore } from "@/store/courseStore";
import { CourseContainer } from "./Course/CourseContainer";
import { CourseContext } from "./CourseContext/CourseContext";

export const Dashboard = () => {
  const { courses } = useCourses();
  const { selectedCourseId, setSelectedCourseId } = useCourseStore();

  useEffect(() => {
    if (courses.length === 0) {
      if (selectedCourseId !== null) {
        setSelectedCourseId(null);
      }
      return;
    }

    const selectedCourseStillExists = courses.some(
      (course) => course.id === selectedCourseId,
    );

    if (!selectedCourseStillExists) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId, setSelectedCourseId]);

  return (
    <div className="flex w-full flex-col gap-4">
      <CourseContainer courses={courses} />
      {selectedCourseId ? <CourseContext courseId={selectedCourseId} /> : null}
    </div>
  );
};
