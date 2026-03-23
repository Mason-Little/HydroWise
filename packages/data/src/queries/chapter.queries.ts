import type { Db } from "@hydrowise/db";
import { chapters } from "@hydrowise/db/schema";
import type { CreateChapterInput } from "@hydrowise/entities";

export const makeChapterRepo = (db: Db) => {
  return {
    listChapters: async () => {
      return db.select().from(chapters);
    },

    createChapter: async (input: CreateChapterInput) => {
      const [row] = await db.insert(chapters).values(input).returning();
      return row;
    },
  };
};
