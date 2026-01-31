import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageRole = pgEnum("message_role", ["user", "assistant"]);

export const chats = pgTable(
  "chats",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chats_user_id_idx").on(table.userId)],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    chatId: text("chat_id").notNull(),
    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("messages_chat_id_idx").on(table.chatId)],
);
