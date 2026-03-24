import type { Db } from "@hydrowise/db";
import { topics } from "@hydrowise/db/schema";
import type { CreateTopicInput } from "@hydrowise/entities";

export const makeTopicRepo = (db: Db) => {
  return {
    listTopics: async () => {
      return db.select().from(topics);
    },
    createTopic: async (input: CreateTopicInput) => {
      const [row] = await db.insert(topics).values(input).returning();
      return row;
    },
  };
};
