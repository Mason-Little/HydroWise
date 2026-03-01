import { useCourses } from "@/hooks/query/course.queries";
import { CourseContainer } from "./Course/CourseContainer";

export const Dashboard = () => {
  const { courses } = useCourses();

  return (
    <div className="flex w-full flex-col gap-4">
      <CourseContainer courses={courses} />
    </div>
  );
};
