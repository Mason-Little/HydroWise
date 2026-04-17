import type { ReactElement } from "react";
import { useState } from "react";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import { DashboardContext } from "@/features/dashboard/dashboard-context";
import { Info } from "@/features/dashboard/Info/Info";

export const Dashboard = (): ReactElement => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const { courses } = useCourses();

  const activeCourse = courses.find((c) => c.id === activeCourseId) ?? null;

  return (
    <DashboardContext.Provider value={{ activeCourse, setActiveCourseId }}>
      <Info />
    </DashboardContext.Provider>
  );
};
