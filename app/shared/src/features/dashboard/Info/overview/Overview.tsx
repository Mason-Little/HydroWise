import { OverviewNotebook } from "@/features/dashboard/Info/overview/OverviewNotebook";
import { OverviewRail } from "@/features/dashboard/Info/overview/OverviewRail";

export const Overview = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
      <OverviewNotebook />
      <OverviewRail />
    </div>
  );
};
