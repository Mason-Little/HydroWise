import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { InstructorTile } from "@/features/dashboard/Info/overview/components/InstructorTile";

export const Overview = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <InstructorTile />
    </div>
  );
};
