import type { Db } from "@hydrowise/db";
import { courses } from "@hydrowise/db/schema";
import type { CreateCourseInput } from "@hydrowise/entities";

export function makeCourseRepo(db: Db) {
  return {
    async listCourses() {
      return db.select().from(courses);
    },

    async createCourse(input: CreateCourseInput) {
      const [row] = await db.insert(courses).values(input).returning();
      return row;
    },
  };
}
