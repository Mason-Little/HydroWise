import { useMemo } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import type { CourseTabItem } from "@/features/workspace/course-tabs/CourseTab";
import { CourseTabs } from "@/features/workspace/course-tabs/CourseTabs";
import {
  compareCoursesByCode,
  courseTabCssVariables,
} from "@/features/workspace/course-tabs/courseTheme";

export const WorkspaceCourseTabs = () => {
  const { courses, activeCourse, setActiveCourseId } = useDashboardContext();

  const tabs = useMemo<readonly CourseTabItem[]>(() => {
    const sortedCourses = [...courses].sort(compareCoursesByCode);
    return sortedCourses.map((course) => ({
      id: course.id,
      code: course.courseCode,
      name: course.courseName,
      style: courseTabCssVariables(course.courseCode),
    }));
  }, [courses]);

  return (
    <CourseTabs
      tabs={tabs}
      activeTabId={activeCourse.id}
      onSelectTab={setActiveCourseId}
    />
  );
};
