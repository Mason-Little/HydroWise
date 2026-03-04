import { cosineDistance, eq, sql } from "drizzle-orm";
import type { DbClient } from "../client";
import { documents } from "../schema";

export type CreateDocumentInput = Pick<
  typeof documents.$inferInsert,
  "title" | "content" | "embedding"
>;

export async function createDocument(db: DbClient, input: CreateDocumentInput) {
  const [document] = await db.insert(documents).values(input).returning();
  return document;
}

export async function listDocuments(db: DbClient, limit = 50) {
  return db.select().from(documents).limit(limit);
}

export async function getDocumentById(db: DbClient, id: string) {
  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  return document ?? null;
}

export async function deleteDocument(db: DbClient, id: string) {
  const [document] = await db
    .delete(documents)
    .where(eq(documents.id, id))
    .returning({ id: documents.id });

  return document ?? null;
}

export async function searchDocuments(
  db: DbClient,
  queryEmbedding: number[],
  limit = 10,
) {
  const distance = cosineDistance(documents.embedding, queryEmbedding);

  return db
    .select({
      id: documents.id,
      title: documents.title,
      content: documents.content,
      similarity: sql<number>`1 - ${distance}`.as("similarity"),
    })
    .from(documents)
    .orderBy(distance)
    .limit(limit);
}
