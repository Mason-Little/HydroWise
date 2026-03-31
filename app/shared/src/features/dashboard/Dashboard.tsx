import type { Queries } from "@hydrowise/data";
import { createContext, useContext, useState } from "react";
import { Info } from "@/features/dashboard/Info/Info";
import {
  courseThemeWorkspaceStyle,
  getCourseTheme,
} from "@/features/dashboard/selection/course-selector/courseTheme";
import { useCourses } from "@/features/dashboard/selection/course-selector/hooks/useCourses";
export type CourseRow = Awaited<ReturnType<Queries["listCourses"]>>[number];

type DashboardContextValue = {
  activeCourse: CourseRow | null;
  setActiveCourseId: (id: string) => void;
};

const DashboardContext = createContext<DashboardContextValue>({
  activeCourse: null,
  setActiveCourseId: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

export const Dashboard = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const { courses } = useCourses();

  const activeCourse = courses.find((c) => c.id === activeCourseId) ?? null;
  const courseWorkspaceStyle = activeCourse
    ? courseThemeWorkspaceStyle(getCourseTheme(activeCourse.courseCode))
    : undefined;

  return (
    <DashboardContext.Provider value={{ activeCourse, setActiveCourseId }}>
      <div className="dashboard-workspace" style={courseWorkspaceStyle}>
        <Info />
      </div>
    </DashboardContext.Provider>
  );
};
