import { useState } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { Policies } from "@/features/dashboard/Info/overview/components/policies/Policies";
import { CourseTodos } from "@/features/dashboard/Info/overview/components/todo/CourseTodos";
import { cn } from "@/lib/utils";

const overviewRailLgGridRows = (
  hasPolicies: boolean,
  tasksComposing: boolean,
): string => {
  if (!hasPolicies) return "lg:grid-rows-[minmax(0,1fr)]";
  if (tasksComposing) return "lg:grid-rows-[minmax(0,1fr)_46px]";
  return "lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]";
};

export const OverviewRail = () => {
  const { activeCourse } = useDashboardContext();
  const [tasksComposing, setTasksComposing] = useState(false);

  if (!activeCourse) return null;

  const policies = activeCourse.policies ?? [];
  const hasPolicies = policies.length > 0;
  const lgGridRows = overviewRailLgGridRows(hasPolicies, tasksComposing);

  return (
    <aside
      className={cn(
        "app-overview-rail hidden min-h-0 w-[min(100%,340px)] shrink-0 px-3 py-2.5",
        "lg:grid lg:h-[var(--overview-notebook-rail-h)] lg:max-h-[var(--overview-notebook-rail-h)] lg:min-h-0 lg:gap-2 lg:overflow-hidden",
        lgGridRows,
      )}
      aria-label="Course tasks and policies"
    >
      <CourseTodos onComposingChange={setTasksComposing} />
      <Policies policies={policies} compressed={tasksComposing} />
    </aside>
  );
};
