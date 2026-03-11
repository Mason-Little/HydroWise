import type { Db } from "@hydrowise/db";
import { makeCourseRepo } from "@/queries/course.queries";

export const makeQueries = (db: Db) => {
  const courses = makeCourseRepo(db);
  return {
    listCourses: courses.listCourses,
    createCourse: courses.createCourse,
  };
};
