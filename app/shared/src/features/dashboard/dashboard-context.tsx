import type { Queries } from "@hydrowise/data";
import { createContext, useContext } from "react";

export type CourseRow = Awaited<ReturnType<Queries["listCourses"]>>[number];

type DashboardContextValue = {
  activeCourse: CourseRow | null;
  setActiveCourseId: (id: string) => void;
};

export const DashboardContext = createContext<DashboardContextValue>({
  activeCourse: null,
  setActiveCourseId: () => {},
});

export const useDashboardContext = (): DashboardContextValue =>
  useContext(DashboardContext);
