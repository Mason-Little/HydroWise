import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { ScopeSummary } from "@/features/quiz/modules/create/ScopeSummary";
import { TopicSelector } from "@/features/quiz/modules/create/selection/TopicSelector";

export const TopicScopePanel = () => {
  const { activeCourse } = useDashboardContext();

  return (
    <div className="space-y-4">
      <ScopeSummary
        title="Topic scope"
        description={
          activeCourse
            ? "Pick one or more topics. Use chapter filtering later if you need to narrow the list."
            : "Select a course above before choosing topics."
        }
      />
      <TopicSelector />
    </div>
  );
};
