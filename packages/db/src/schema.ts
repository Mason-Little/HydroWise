import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

type CourseChapter = {
  id: string;
  title: string;
  order: number;
};

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courseStatus = pgEnum("course_status", ["active", "inactive"]);

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  number: text("number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: courseStatus("status").notNull(),
  chapters: jsonb("chapters").$type<CourseChapter[]>().notNull().default([]),
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

export const documents = pgTable(
  "documents",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    courseId: text("course_id").references(() => courses.id),
    chapterId: text("chapter_id"),
    name: text("name").notNull(),
    mimeType: text("mime_type").notNull(),
    fileSize: integer("file_size").notNull(),
    pageCount: integer("page_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("documents_user_id_idx").on(table.userId),
    index("documents_course_id_idx").on(table.courseId),
    index("documents_user_course_idx").on(table.userId, table.courseId),
    index("documents_user_course_chapter_idx").on(
      table.userId,
      table.courseId,
      table.chapterId,
    ),
  ],
);

export const documentEmbeddings = pgTable(
  "document_embeddings",
  {
    id: text("id").primaryKey(),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("document_embeddings_document_id_idx").on(table.documentId),
  ],
);
