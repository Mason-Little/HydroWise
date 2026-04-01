import type { Db } from "@hydrowise/db";
import { documents } from "@hydrowise/db/schema";
import type { CreateDocumentInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";

export const makeDocumentRepo = (db: Db) => {
  return {
    listDocuments: async () => {
      return db.select().from(documents);
    },
    listDocumentsByChapter: async (chapterId: string) => {
      return db
        .select()
        .from(documents)
        .where(eq(documents.chapterId, chapterId));
    },
    createDocument: async (input: CreateDocumentInput) => {
      const [row] = await db.insert(documents).values(input).returning();
      return row;
    },
  };
};
