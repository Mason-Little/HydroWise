import type { CreateTopicInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { topics } from "../schema";

export async function createTopic(db: DbClient, input: CreateTopicInput) {
  const [topic] = await db.insert(topics).values(input).returning();
  return topic;
}

export async function listTopicsByChapter(db: DbClient, chapterId: string) {
  return db.select().from(topics).where(eq(topics.chapterId, chapterId));
}

export async function getTopicById(db: DbClient, id: string) {
  const [topic] = await db
    .select()
    .from(topics)
    .where(eq(topics.id, id))
    .limit(1);
  return topic ?? null;
}

export async function deleteTopic(db: DbClient, id: string) {
  const [topic] = await db
    .delete(topics)
    .where(eq(topics.id, id))
    .returning({ id: topics.id });
  return topic ?? null;
}
