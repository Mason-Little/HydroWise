import type { Db } from "@hydrowise/db";
import { chatMessages } from "@hydrowise/db/schema";
import {
  type CreateChatMessageInput,
  CreateChatMessageInputSchema,
} from "@hydrowise/entities";
import { asc, eq } from "drizzle-orm";

export const makeChatMessageRepo = (db: Db) => {
  return {
    createChatMessage: async (input: CreateChatMessageInput) => {
      const messageInput = CreateChatMessageInputSchema.parse(input);
      const [row] = await db
        .insert(chatMessages)
        .values(messageInput)
        .returning();
      return row;
    },
    listChatMessages: async (threadId: string) => {
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, threadId))
        .orderBy(asc(chatMessages.createdAt));
    },
  };
};
