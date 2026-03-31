import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { OverviewNotebook } from "@/features/dashboard/Info/overview/OverviewNotebook";
import { OverviewRail } from "@/features/dashboard/Info/overview/OverviewRail";

export const Overview = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) return null;

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
      <OverviewNotebook />
      <OverviewRail />
    </div>
  );
};
