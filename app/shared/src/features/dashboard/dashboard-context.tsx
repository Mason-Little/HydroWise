import type { Queries } from "@hydrowise/data";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export type CourseRow = Awaited<ReturnType<Queries["listCourses"]>>[number];

export type CourseWorkspaceContextValue = {
  courses: CourseRow[];
  activeCourse: CourseRow;
  setActiveCourseId: (id: string) => void;
};

type ReadyCourseWorkspace = Pick<
  CourseWorkspaceContextValue,
  "courses" | "activeCourse"
>;

export const DashboardContext =
  createContext<CourseWorkspaceContextValue | null>(null);

const resolveReadyCourse = (
  courses: CourseRow[],
  activeCourseId: string | null,
): ReadyCourseWorkspace | null => {
  if (courses.length === 0) {
    return null;
  }

  return {
    courses,
    activeCourse:
      courses.find((course) => course.id === activeCourseId) ?? courses[0],
  };
};

export const CourseWorkspaceBoundary = ({
  courses,
  isLoading,
  isError,
  activeCourseId,
  setActiveCourseId,
  children,
}: {
  courses: CourseRow[];
  isLoading: boolean;
  isError: boolean;
  activeCourseId: string | null;
  setActiveCourseId: (id: string) => void;
  children: (workspace: CourseWorkspaceContextValue) => ReactNode;
}) => {
  if (isError) {
    return <div className="text-destructive">Failed to load courses.</div>;
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading courses…</div>;
  }

  if (courses.length === 0) {
    return <div className="text-muted-foreground">No courses yet.</div>;
  }

  const readyCourse = resolveReadyCourse(courses, activeCourseId);

  if (!readyCourse) {
    return null;
  }

  return children({
    ...readyCourse,
    setActiveCourseId,
  });
};

export const useDashboardContext = (): CourseWorkspaceContextValue => {
  const value = useContext(DashboardContext);

  if (!value) {
    throw new Error(
      "useDashboardContext must be used within a ready course workspace.",
    );
  }

  return value;
};
