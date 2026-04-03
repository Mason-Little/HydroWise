import type { ChatMessagePayload } from "@hydrowise/entities";
import { jsonb, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { chatThreads } from "@/schema/chat-thread";

export const chatMessageRole = pgEnum("chat_message_role", [
  "user",
  "assistant",
]);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => chatThreads.id, { onDelete: "cascade" }),
  role: chatMessageRole("role").notNull(),
  payload: jsonb("payload").$type<ChatMessagePayload>().notNull(),
});
