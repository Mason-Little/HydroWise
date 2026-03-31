import { Policies } from "@/features/dashboard/Info/overview/components/policies/Policies";
import { CourseTodos } from "@/features/dashboard/Info/overview/components/todo/CourseTodos";

export const OverviewRail = () => {
  return (
    <div className="flex min-h-0 w-full flex-col gap-3 lg:basis-80 lg:shrink-0 lg:grow-0">
      <CourseTodos />
      <Policies />
    </div>
  );
};
