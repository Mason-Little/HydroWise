import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { ScopeSummary } from "@/features/quiz/modules/create/ScopeSummary";

export const CourseScopePanel = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) {
    return (
      <ScopeSummary
        title="Course scope"
        description="Select a course above to generate a quiz from the full course."
      />
    );
  }

  return (
    <ScopeSummary
      title="Course scope"
      description={`Quiz will use all chapters, topics, and documents from ${activeCourse.courseName}.`}
    />
  );
};
