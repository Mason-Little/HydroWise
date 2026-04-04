import type { Db } from "@hydrowise/db";
import { chatThreads } from "@hydrowise/db/schema";
import {
  type PatchChatThreadInput,
  PatchChatThreadInputSchema,
} from "@hydrowise/entities";
import { desc, eq } from "drizzle-orm";

export const makeChatThreadRepo = (db: Db) => {
  return {
    listChatThreads: async () => {
      return db
        .select()
        .from(chatThreads)
        .orderBy(desc(chatThreads.createdAt));
    },
    createChatThread: async (title = "newChat") => {
      const [row] = await db
        .insert(chatThreads)
        .values({ title })
        .returning();
      return row;
    },
    patchChatThread: async (threadId: string, patch: PatchChatThreadInput) => {
      const parsed = PatchChatThreadInputSchema.parse(patch);
      await db
        .update(chatThreads)
        .set(parsed)
        .where(eq(chatThreads.id, threadId));
    },
  };
};
