import type { Db } from "@hydrowise/db";
import { courses } from "@hydrowise/db/schema";
import type { CreateCourseInput } from "@hydrowise/entities";

export const makeCourseRepo = (db: Db) => {
  return {
    listCourses: async () => {
      return db.select().from(courses);
    },

    createCourse: async (input: CreateCourseInput) => {
      const [row] = await db.insert(courses).values(input).returning();
      return row;
    },
  };
};
