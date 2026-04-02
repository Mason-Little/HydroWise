import type { Db } from "@hydrowise/db";
import { pages } from "@hydrowise/db/schema";
import type { CreatePageInput } from "@hydrowise/entities";
import { and, eq } from "drizzle-orm";

export const makePageRepo = (db: Db) => {
  return {
    getPage: async (documentId: string, pageNumber: number) => {
      const [row] = await db
        .select()
        .from(pages)
        .where(
          and(
            eq(pages.documentId, documentId),
            eq(pages.pageNumber, pageNumber),
          ),
        );
      return row;
    },
    createPage: async (input: CreatePageInput) => {
      const [row] = await db.insert(pages).values(input).returning();
      return row;
    },
  };
};
