import type { Queries } from "@hydrowise/data";
import { createContext, useContext, useState } from "react";
import { Info } from "@/features/dashboard/Info/Info";
import { Selection } from "@/features/dashboard/selection/Selection";

type CourseRow = Awaited<ReturnType<Queries["listCourses"]>>[number];

type DashboardContextValue = {
  activeCourse: CourseRow | null;
  setActiveCourse: (course: CourseRow) => void;
};

const DashboardContext = createContext<DashboardContextValue>({
  activeCourse: null,
  setActiveCourse: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

export const Dashboard = () => {
  const [activeCourse, setActiveCourse] = useState<CourseRow | null>(null);

  return (
    <DashboardContext.Provider value={{ activeCourse, setActiveCourse }}>
      <div>
        <Selection />
        <Info />
      </div>
    </DashboardContext.Provider>
  );
};
