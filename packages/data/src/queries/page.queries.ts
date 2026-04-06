import type { Db } from "@hydrowise/db";
import { pages } from "@hydrowise/db/schema";
import type { CreatePageInput } from "@hydrowise/entities";
import { and, cosineDistance, eq } from "drizzle-orm";

export const makePageRepo = (db: Db) => ({
  getPage: async (documentId: string, pageNumber: number) => {
    const [row] = await db
      .select()
      .from(pages)
      .where(
        and(eq(pages.documentId, documentId), eq(pages.pageNumber, pageNumber)),
      );
    return row;
  },
  getPageById: async (pageId: string) => {
    const [row] = await db.select().from(pages).where(eq(pages.id, pageId));
    return row;
  },
  searchPages: async (embedding: number[], limit: number = 10) => {
    const rows = await db
      .select({
        pageId: pages.id,
        pageContent: pages.pageContent,
      })
      .from(pages)
      .orderBy(cosineDistance(pages.pageEmbedding, embedding))
      .limit(limit);
    return rows;
  },
  createPage: async (input: CreatePageInput) => {
    const [row] = await db.insert(pages).values(input).returning();
    return row;
  },
});
