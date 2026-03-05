import type { CreateChunkInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { chunks } from "../schema";

export async function createChunk(db: DbClient, input: CreateChunkInput) {
  const [chunk] = await db.insert(chunks).values(input).returning();
  return chunk;
}

export async function listChunksByDocument(db: DbClient, documentId: string) {
  return db.select().from(chunks).where(eq(chunks.documentId, documentId));
}

export async function getChunkById(db: DbClient, id: string) {
  const [chunk] = await db
    .select()
    .from(chunks)
    .where(eq(chunks.id, id))
    .limit(1);
  return chunk ?? null;
}

export async function deleteChunk(db: DbClient, id: string) {
  const [chunk] = await db
    .delete(chunks)
    .where(eq(chunks.id, id))
    .returning({ id: chunks.id });
  return chunk ?? null;
}
