import { useDashboardContext } from "@/features/dashboard/Dashboard";

export const Overview = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold">{activeCourse.courseName}</h2>
      <p className="text-sm text-muted-foreground">{activeCourse.courseCode}</p>
    </div>
  );
};
