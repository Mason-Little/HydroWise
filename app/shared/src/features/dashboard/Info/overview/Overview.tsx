import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { CourseDetails } from "@/features/dashboard/Info/overview/components/course-details/CourseDetails";
import { Grades } from "@/features/dashboard/Info/overview/components/grades/Grades";
import { InstructorTile } from "@/features/dashboard/Info/overview/components/instructor/InstructorTile";
import { Policies } from "@/features/dashboard/Info/overview/components/policies/Policies";
import { CourseTodos } from "@/features/dashboard/Info/overview/components/todo/CourseTodos";

export const Overview = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) return null;

  return (
    <div className="grid gap-2.5 xl:grid-cols-[minmax(17rem,20rem)_minmax(22rem,1fr)_minmax(14rem,0.75fr)]">
      <div className="flex min-h-0 flex-col gap-2.5">
        <InstructorTile />
        <CourseDetails />
        <Policies />
      </div>
      <div className="flex min-h-0 flex-col">
        <Grades />
      </div>
      <div className="flex min-h-0 flex-col">
        <CourseTodos />
      </div>
    </div>
  );
};
