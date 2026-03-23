import type { Db } from "@hydrowise/db";
import { makeChapterRepo } from "@/queries/chapter.queries";
import { makeCourseRepo } from "@/queries/course.queries";

export const makeQueries = (db: Db) => {
  const courses = makeCourseRepo(db);
  const chapters = makeChapterRepo(db);
  return {
    listCourses: courses.listCourses,
    createCourse: courses.createCourse,
    listChapters: chapters.listChapters,
    createChapter: chapters.createChapter,
  };
};
