import { getQueries } from "@hydrowise/data";
import type {
  ChatOrchestratorInput,
  WorkspaceContextItem,
} from "@hydrowise/entities";

export type ChatWorkspaceContext = NonNullable<
  ChatOrchestratorInput["workspaceContext"]
>;

export const getWorkspaceContext = async (): Promise<ChatWorkspaceContext> => {
  const queries = await getQueries();
  const [courses, allChapters] = await Promise.all([
    queries.listCourses(),
    queries.listChapters(),
  ]);

  const chaptersByCourseId = new Map<
    string,
    WorkspaceContextItem["chapters"]
  >();
  for (const ch of allChapters) {
    const slice = chaptersByCourseId.get(ch.courseId) ?? [];
    slice.push({
      chapterName: ch.chapterName,
      chapterDescription: ch.chapterDescription,
    });
    chaptersByCourseId.set(ch.courseId, slice);
  }

  return courses.map((course) => ({
    courseId: course.id,
    courseName: course.courseName,
    chapters: chaptersByCourseId.get(course.id) ?? [],
  }));
};
