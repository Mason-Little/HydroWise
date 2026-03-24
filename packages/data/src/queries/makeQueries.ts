import type { Db } from "@hydrowise/db";
import { makeChapterRepo } from "@/queries/chapter.queries";
import { makeCourseRepo } from "@/queries/course.queries";
import { makeDocumentRepo } from "./document.queries";
import { makeTopicRepo } from "./topic.queries";

export const makeQueries = (db: Db) => {
  const courses = makeCourseRepo(db);
  const chapters = makeChapterRepo(db);
  const topics = makeTopicRepo(db);
  const documents = makeDocumentRepo(db);
  return {
    listCourses: courses.listCourses,
    createCourse: courses.createCourse,
    listChapters: chapters.listChapters,
    createChapter: chapters.createChapter,
    listTopics: topics.listTopics,
    createTopic: topics.createTopic,
    listDocuments: documents.listDocuments,
    createDocument: documents.createDocument,
  };
};
