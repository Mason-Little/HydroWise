import { useState } from "react";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import { DashboardContext } from "@/features/dashboard/dashboard-context";
import { QuizHeader } from "@/features/quiz/components/QuizHeader";
import { QuizModeOutlet } from "@/features/quiz/components/QuizModeOutlet";
import { QuizProvider } from "@/features/quiz/context/quiz-context";
import { courseWorkspaceCssVariables } from "@/features/workspace/course-tabs/courseTheme";
import { WorkspaceCourseTabs } from "@/features/workspace/course-tabs/WorkspaceCourseTabs";
import { WorkspaceShell } from "@/features/workspace/WorkspaceShell";

export const Quiz = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const { courses } = useCourses();

  const activeCourse =
    courses.find((course) => course.id === activeCourseId) ?? null;
  const workspaceStyle = activeCourse
    ? courseWorkspaceCssVariables(activeCourse.courseCode)
    : {};

  return (
    <DashboardContext.Provider
      value={{
        activeCourse,
        setActiveCourseId,
      }}
    >
      <QuizProvider>
        <WorkspaceShell
          tabs={<WorkspaceCourseTabs />}
          header={<QuizHeader />}
          tabsMode="hover-reveal"
          className="mt-0"
          style={workspaceStyle}
        >
          <QuizModeOutlet />
        </WorkspaceShell>
      </QuizProvider>
    </DashboardContext.Provider>
  );
};
