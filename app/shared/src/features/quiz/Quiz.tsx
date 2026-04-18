import { useState } from "react";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import {
  CourseWorkspaceBoundary,
  DashboardContext,
} from "@/features/dashboard/dashboard-context";
import { QuizHeader } from "@/features/quiz/components/QuizHeader";
import { QuizModeOutlet } from "@/features/quiz/components/QuizModeOutlet";
import { QuizProvider } from "@/features/quiz/context/quiz-context";
import { courseWorkspaceCssVariables } from "@/features/workspace/course-tabs/courseTheme";
import { WorkspaceCourseTabs } from "@/features/workspace/course-tabs/WorkspaceCourseTabs";
import { WorkspaceShell } from "@/features/workspace/WorkspaceShell";

export const Quiz = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const { courses, isLoading, isError } = useCourses();
  return (
    <CourseWorkspaceBoundary
      courses={courses}
      isLoading={isLoading}
      isError={isError}
      activeCourseId={activeCourseId}
      setActiveCourseId={setActiveCourseId}
    >
      {(workspace) => (
        <DashboardContext.Provider value={workspace}>
          <QuizProvider>
            <WorkspaceShell
              tabs={<WorkspaceCourseTabs />}
              header={<QuizHeader />}
              tabsMode="hover-reveal"
              className="mt-0"
              style={courseWorkspaceCssVariables(
                workspace.activeCourse.courseCode,
              )}
            >
              <QuizModeOutlet />
            </WorkspaceShell>
          </QuizProvider>
        </DashboardContext.Provider>
      )}
    </CourseWorkspaceBoundary>
  );
};
