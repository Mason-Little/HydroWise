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
  documentId: string;
  abstracts: string[];
};

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
    return { chapterId: chapter.id };
  }

  const createdChapter = await queries.createChapter({
    ...route.chapter.chapter,
    courseId,
  });
  return { chapterId: createdChapter.id };
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
    return { topicId: topic.id };
  }

  const createdTopic = await queries.createTopic({
    ...route.topic.topic,
    chapterId,
  });
  return { topicId: createdTopic.id };
};

export const handleDocument = async (
  pages: string[],
): Promise<RoutedDocumentResult> => {
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

  console.log("[upload] course tree", courseTree);
  console.log("[upload] abstracts text", abstractsText);
  const route = await documentRouter(abstractsText, courseTree);

  if (route.status === "unroutable") {
    throw new Error(`[upload] Document route is unroutable: ${route.reason}`);
  }

  const course = courses.find(
    (c) => normalize(c.courseCode) === normalize(route.courseCode),
  );

  if (!course) {
    throw new Error(
      `[upload] Router returned unknown course: ${route.courseCode}`,
    );
  }

  const { chapterId } = await resolveChapterTarget(
    route,
    course.id,
    chapters,
    queries,
  );
  const { topicId } = await resolveTopicTarget(
    route,
    chapterId,
    topics,
    queries,
  );

  const document = await queries.createDocument({
    name: route.title,
    description: route.description,
    courseId: course.id,
    chapterId,
    topicId,
  });

  console.log("[upload] document created", document);

  const result: RoutedDocumentResult = {
    documentId: document.id,
    abstracts: abstracts.pages?.map((p) => p.abstract) ?? [],
  };
  return result;
};
