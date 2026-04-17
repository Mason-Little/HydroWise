import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { ScopeSummary } from "@/features/quiz/modules/create/ScopeSummary";
import { DocumentSelector } from "@/features/quiz/modules/create/selection/DocumentSelector";

export const DocumentScopePanel = () => {
  const { activeCourse } = useDashboardContext();

  return (
    <div className="space-y-4">
      <ScopeSummary
        title="Document scope"
        description={
          activeCourse
            ? "Pick one or more documents. Use chapter and topic filters later to narrow the list."
            : "Select a course above before choosing documents."
        }
      />
      <DocumentSelector />
    </div>
  );
};
