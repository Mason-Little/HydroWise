import type { CreateDocumentInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { documents } from "../schema";

export async function createDocument(db: DbClient, input: CreateDocumentInput) {
  const [document] = await db.insert(documents).values(input).returning();
  return document;
}

export async function listDocumentsByChapter(db: DbClient, chapterId: string) {
  return db.select().from(documents).where(eq(documents.chapterId, chapterId));
}

export async function getDocumentById(db: DbClient, id: string) {
  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);
  return document ?? null;
}

export async function setDocumentTopic(
  db: DbClient,
  id: string,
  topicId: string,
) {
  const [document] = await db
    .update(documents)
    .set({ topicId, embeddingStatus: "completed" })
    .where(eq(documents.id, id))
    .returning();
  return document ?? null;
}

export async function deleteDocument(db: DbClient, id: string) {
  const [document] = await db
    .delete(documents)
    .where(eq(documents.id, id))
    .returning({ id: documents.id });
  return document ?? null;
}
