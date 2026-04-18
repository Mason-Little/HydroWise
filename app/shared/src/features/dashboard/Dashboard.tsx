import type { ReactElement } from "react";
import { useState } from "react";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import {
  CourseWorkspaceBoundary,
  DashboardContext,
} from "@/features/dashboard/dashboard-context";
import { Info } from "@/features/dashboard/Info/Info";

export const Dashboard = (): ReactElement => {
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
          <Info />
        </DashboardContext.Provider>
      )}
    </CourseWorkspaceBoundary>
  );
};
