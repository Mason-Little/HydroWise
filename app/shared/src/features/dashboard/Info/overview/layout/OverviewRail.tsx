import { Policies } from "@/features/dashboard/Info/overview/components/policies/Policies";
import { CourseTodos } from "@/features/dashboard/Info/overview/components/todo/CourseTodos";

export const OverviewRail = () => (
  <div className="flex min-h-0 w-full flex-col gap-3 lg:basis-80 lg:shrink-0 lg:grow-0 lg:grid lg:h-[var(--overview-pane-h)] lg:min-h-[280px] lg:max-h-[var(--overview-pane-h)] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-3 lg:overflow-hidden lg:[&>*]:min-h-0 lg:[&>*]:overflow-hidden">
    <CourseTodos />
    <Policies />
  </div>
);
