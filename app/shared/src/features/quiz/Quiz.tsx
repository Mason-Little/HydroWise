import { useState } from "react";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import { DashboardContext } from "@/features/dashboard/dashboard-context";
import { courseWorkspaceCssVariables } from "@/features/workspace/course-tabs/courseTheme";
import { WorkspaceShell } from "@/features/workspace/WorkspaceShell";
import { WorkspaceCourseTabs } from "../workspace/course-tabs/WorkspaceCourseTabs";

export const Quiz = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const { courses } = useCourses();

  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? null;

  return (
    <DashboardContext.Provider
      value={{
        activeCourse,
        setActiveCourseId,
      }}
    >
      <WorkspaceShell
        tabs={<WorkspaceCourseTabs />}
        header={null}
        style={activeCourse ? courseWorkspaceCssVariables(activeCourse.courseCode) : undefined}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
          <p className="text-sm text-[var(--app-text-muted)]">
            Pick a course above to start the quiz workspace.
          </p>
        </div>
      </WorkspaceShell>
    </DashboardContext.Provider>
  );
};
