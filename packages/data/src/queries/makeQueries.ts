import type { Db } from "@hydrowise/db";
import { makeChapterRepo } from "@/queries/chapter.queries";
import { makeCourseRepo } from "@/queries/course.queries";
import { makeDocumentRepo } from "@/queries/document.queries";
import { makePageRepo } from "@/queries/page.queries";
import { makeTopicRepo } from "@/queries/topic.queries";

export const makeQueries = (db: Db) => {
  const courses = makeCourseRepo(db);
  const chapters = makeChapterRepo(db);
  const topics = makeTopicRepo(db);
  const documents = makeDocumentRepo(db);
  const pages = makePageRepo(db);
  return {
    listCourses: courses.listCourses,
    createCourse: courses.createCourse,
    listChapters: chapters.listChapters,
    createChapter: chapters.createChapter,
    listTopics: topics.listTopics,
    createTopic: topics.createTopic,
    listDocuments: documents.listDocuments,
    createDocument: documents.createDocument,
    createPage: pages.createPage,
  };
};
