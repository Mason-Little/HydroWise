import type { Db } from "@hydrowise/db";
import { chapters, documents, pages, topics } from "@hydrowise/db/schema";
import type { CreatePageInput } from "@hydrowise/entities";
import { and, asc, cosineDistance, eq, type SQL } from "drizzle-orm";

const selectScopedPageRows = (db: Db) =>
  db
    .select({
      chapterId: chapters.id,
      chapterName: chapters.name,
      chapterDescription: chapters.description,
      topicId: topics.id,
      topicName: topics.name,
      topicDescription: topics.description,
      documentId: documents.id,
      documentName: documents.name,
      documentDescription: documents.description,
      pageNumber: pages.pageNumber,
      abstract: pages.pageAbstract,
    })
    .from(pages)
    .innerJoin(documents, eq(pages.documentId, documents.id))
    .innerJoin(chapters, eq(documents.chapterId, chapters.id))
    .leftJoin(topics, eq(documents.topicId, topics.id));

const listScopedPages = (db: Db, condition: SQL) =>
  selectScopedPageRows(db)
    .where(condition)
    .orderBy(
      asc(chapters.name),
      asc(topics.name),
      asc(documents.name),
      asc(pages.pageNumber),
    );

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
  listPagesByCourse: async (courseId: string) => {
    return listScopedPages(db, eq(chapters.courseId, courseId));
  },
  listPagesByChapter: async (chapterId: string) => {
    return listScopedPages(db, eq(chapters.id, chapterId));
  },
  listPagesByTopic: async (topicId: string) => {
    return listScopedPages(db, eq(topics.id, topicId));
  },
  listPagesByDocument: async (documentId: string) => {
    return listScopedPages(db, eq(documents.id, documentId));
  },
});
