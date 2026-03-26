import type { Db } from "@hydrowise/db";
import { courses } from "@hydrowise/db/schema";
import type {
  CreateCourseInput,
  ProfessorInformation,
} from "@hydrowise/entities";
import { eq } from "drizzle-orm";

export const makeCourseRepo = (db: Db) => {
  return {
    listCourses: async () => {
      return db.select().from(courses);
    },

    createCourse: async (input: CreateCourseInput) => {
      const [row] = await db.insert(courses).values(input).returning();
      return row;
    },

    updateProfessorInformation: async (
      courseId: string,
      patch: Partial<ProfessorInformation>,
    ) => {
      const [existing] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));
      if (!existing) throw new Error(`Course not found: ${courseId}`);

      const updated = { ...existing.professorInformation, ...patch };
      const [row] = await db
        .update(courses)
        .set({ professorInformation: updated })
        .where(eq(courses.id, courseId))
        .returning();
      return row;
    },
  };
};
