import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { CourseDetails } from "@/features/dashboard/Info/overview/components/course-details/CourseDetails";
import { InstructorTile } from "@/features/dashboard/Info/overview/components/instructor/InstructorTile";
import { Policies } from "@/features/dashboard/Info/overview/components/policies/Policies";

export const Overview = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <InstructorTile />
      <CourseDetails />
      <Policies />
    </div>
  );
};
