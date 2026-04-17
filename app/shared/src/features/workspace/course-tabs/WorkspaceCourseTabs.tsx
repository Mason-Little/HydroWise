import { useEffect, useMemo } from "react";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import type { CourseTabItem } from "@/features/workspace/course-tabs/CourseTab";
import { CourseTabs } from "@/features/workspace/course-tabs/CourseTabs";
import {
  compareCoursesByCode,
  courseTabCssVariables,
} from "@/features/workspace/course-tabs/courseTheme";

type WorkspaceCourseTabsProps = {
  tabsMode?: "always" | "hover-reveal";
  isExpanded?: boolean;
};

export const WorkspaceCourseTabs = ({
  tabsMode = "always",
  isExpanded = true,
}: WorkspaceCourseTabsProps) => {
  const { activeCourse, setActiveCourseId } = useDashboardContext();
  const { courses, isLoading, isError } = useCourses();

  const tabs = useMemo<readonly CourseTabItem[]>(() => {
    const sortedCourses = [...courses].sort(compareCoursesByCode);
    return sortedCourses.map((course) => ({
      id: course.id,
      code: course.courseCode,
      name: course.courseName,
      style: courseTabCssVariables(course.courseCode),
    }));
  }, [courses]);

  useEffect(() => {
    if (courses.length > 0 && !activeCourse) {
      setActiveCourseId(courses[0].id);
    }
  }, [courses, activeCourse, setActiveCourseId]);

  if (isLoading)
    return <div className="text-muted-foreground">Loading courses…</div>;
  if (isError)
    return <div className="text-destructive">Failed to load courses.</div>;
  if (courses.length === 0)
    return <div className="text-muted-foreground">No courses yet.</div>;

  return (
    <CourseTabs
      tabs={tabs}
      activeTabId={activeCourse?.id ?? null}
      onSelectTab={setActiveCourseId}
      tabsMode={tabsMode}
      isExpanded={isExpanded}
    />
  );
};
