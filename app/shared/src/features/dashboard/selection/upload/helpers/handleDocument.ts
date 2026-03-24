import {
  type CourseTree,
  documentRouter,
  pageAbstracts,
} from "@hydrowise/ai-runtime";
import { getQueries, type Queries } from "@hydrowise/data";
import type {
  Chapter,
  Course,
  DocumentRoute,
  Topic,
} from "@hydrowise/entities";

type ReadyDocumentRoute = Extract<DocumentRoute, { status: "ready" }>;

type RoutedDocumentResult = {
  status: "routed";
  courseId: string;
  chapterId: string;
  topicId: string;
  createdChapter: Chapter | null;
  createdTopic: Topic | null;
};

export type HandleDocumentResult =
  | RoutedDocumentResult
  | Extract<DocumentRoute, { status: "unroutable" }>;

const normalize = (s: string) => s.trim().toLowerCase();

const buildCourseTree = (
  courses: Course[],
  chapters: Chapter[],
  topics: Topic[],
): CourseTree =>
  courses.map((course) => ({
    courseName: course.courseName,
    courseCode: course.courseCode,
    chapters: chapters
      .filter((ch) => ch.courseId === course.id)
      .map((ch) => ({
        chapterName: ch.chapterName,
        chapterDescription: ch.chapterDescription,
        topics: topics
          .filter((t) => t.chapterId === ch.id)
          .map((t) => ({
            topicName: t.name,
            topicDescription: t.description,
          })),
      })),
  }));

const resolveChapterTarget = async (
  route: ReadyDocumentRoute,
  courseId: string,
  chapters: Chapter[],
  queries: Pick<Queries, "createChapter">,
) => {
  if (route.chapter.pick === "match") {
    const chapterName = route.chapter.chapterName;
    const chapter = chapters.find(
      (ch) =>
        ch.courseId === courseId &&
        normalize(ch.chapterName) === normalize(chapterName),
    );
    if (!chapter) {
      throw new Error(
        `[upload] Router returned unknown chapter: ${chapterName}`,
      );
    }
    return { chapterId: chapter.id, createdChapter: null };
  }

  const createdChapter = await queries.createChapter({
    ...route.chapter.chapter,
    courseId,
  });
  return { chapterId: createdChapter.id, createdChapter };
};

const resolveTopicTarget = async (
  route: ReadyDocumentRoute,
  chapterId: string,
  topics: Topic[],
  queries: Pick<Queries, "createTopic">,
) => {
  if (route.topic.pick === "match") {
    const topicName = route.topic.name;
    const topic = topics.find(
      (t) =>
        t.chapterId === chapterId && normalize(t.name) === normalize(topicName),
    );
    if (!topic) {
      throw new Error(`[upload] Router returned unknown topic: ${topicName}`);
    }
    return { topicId: topic.id, createdTopic: null };
  }

  const createdTopic = await queries.createTopic({
    ...route.topic.topic,
    chapterId,
  });
  return { topicId: createdTopic.id, createdTopic };
};

export const handleDocument = async (
  pages: string[],
): Promise<HandleDocumentResult> => {
  const queries = await getQueries();
  const pageInput = pages
    .map((page, index) => `Page ${index + 1}\n${page}`)
    .join("\n");

  const [abstracts, courses, chapters, topics] = await Promise.all([
    pageAbstracts(pageInput),
    queries.listCourses(),
    queries.listChapters(),
    queries.listTopics(),
  ]);

  const courseTree = buildCourseTree(courses, chapters, topics);

  const abstractsText =
    abstracts.pages
      ?.map((p) => `Page ${p.pageNumber}: ${p.abstract}`)
      .join("\n") ?? "";

  const route = await documentRouter(abstractsText, courseTree);

  if (route.status === "unroutable") {
    console.log("[upload] document route", route);
    return route;
  }

  const course = courses.find(
    (c) => normalize(c.courseCode) === normalize(route.courseCode),
  );

  if (!course) {
    throw new Error(
      `[upload] Router returned unknown course: ${route.courseCode}`,
    );
  }

  const { chapterId, createdChapter } = await resolveChapterTarget(
    route,
    course.id,
    chapters,
    queries,
  );
  const { topicId, createdTopic } = await resolveTopicTarget(
    route,
    chapterId,
    topics,
    queries,
  );

  const result: RoutedDocumentResult = {
    status: "routed",
    courseId: course.id,
    chapterId,
    topicId,
    createdChapter,
    createdTopic,
  };
  console.log("[upload] document route", result);
  return result;
};
