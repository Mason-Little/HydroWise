import type { Db } from "@hydrowise/db";
import { chapters, topics } from "@hydrowise/db/schema";
import type { CreateTopicInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";

export const makeTopicRepo = (db: Db) => {
  return {
    listTopics: async () => {
      return db.select().from(topics);
    },
    listTopicsByChapter: async (chapterId: string) => {
      return db.select().from(topics).where(eq(topics.chapterId, chapterId));
    },
    listTopicsByCourse: async (courseId: string) => {
      return db
        .select()
        .from(topics)
        .innerJoin(chapters, eq(topics.chapterId, chapters.id))
        .where(eq(chapters.courseId, courseId))
        .then((rows) => rows.map((row) => row.topics));
    },
    createTopic: async (input: CreateTopicInput) => {
      const [row] = await db.insert(topics).values(input).returning();
      return row;
    },
  };
};
