import type { Db } from "@hydrowise/db";
import { documents } from "@hydrowise/db/schema";
import type { CreateDocumentInput } from "@hydrowise/entities";

export const makeDocumentRepo = (db: Db) => {
  return {
    listDocuments: async () => {
      return db.select().from(documents);
    },
    createDocument: async (input: CreateDocumentInput) => {
      const [row] = await db.insert(documents).values(input).returning();
      return row;
    },
  };
};
