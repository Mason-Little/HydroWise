import type { CreateChapterInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { chapters } from "../schema";

export async function createChapter(db: DbClient, input: CreateChapterInput) {
  const [chapter] = await db.insert(chapters).values(input).returning();
  return chapter;
}

export async function listChaptersByCourse(db: DbClient, courseId: string) {
  return db.select().from(chapters).where(eq(chapters.courseId, courseId));
}

export async function getChapterById(db: DbClient, id: string) {
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.id, id))
    .limit(1);
  return chapter ?? null;
}

export async function deleteChapter(db: DbClient, id: string) {
  const [chapter] = await db
    .delete(chapters)
    .where(eq(chapters.id, id))
    .returning({ id: chapters.id });
  return chapter ?? null;
}
