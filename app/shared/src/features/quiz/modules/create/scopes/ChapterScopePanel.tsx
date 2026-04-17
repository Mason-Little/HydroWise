import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { ScopeSummary } from "@/features/quiz/modules/create/ScopeSummary";
import { ChapterSelector } from "@/features/quiz/modules/create/selection/ChapterSelector";

export const ChapterScopePanel = () => {
  const { activeCourse } = useDashboardContext();

  return (
    <div className="space-y-4">
      <ScopeSummary
        title="Chapter scope"
        description={
          activeCourse
            ? "Pick one or more chapters. Topics and documents are derived from those chapters."
            : "Select a course above before choosing chapters."
        }
      />
      <ChapterSelector />
    </div>
  );
};
