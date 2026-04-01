import type { Db } from "@hydrowise/db";
import { chapters } from "@hydrowise/db/schema";
import type { CreateChapterInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";

export const makeChapterRepo = (db: Db) => {
  return {
    listChapters: async () => {
      return db.select().from(chapters);
    },

    listChaptersByCourse: async (courseId: string) => {
      return db.select().from(chapters).where(eq(chapters.courseId, courseId));
    },

    createChapter: async (input: CreateChapterInput) => {
      const [row] = await db.insert(chapters).values(input).returning();
      return row;
    },
  };
};
