import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { documents } from "@/schema/documents";
import { bytea } from "@/types/bytea";

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    pageAbstract: text("page_abstract").notNull(),
    pageContent: text("page_content").notNull(),
    pageImage: bytea("page_image"),
    pageEmbedding: vector("page_embedding", { dimensions: 384 }).notNull(),
    pageNumber: integer("page_number").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("pages_document_id_page_number_uidx").on(
      table.documentId,
      table.pageNumber,
    ),
    index("pages_embedding_cosine_idx").using(
      "hnsw",
      table.pageEmbedding.op("vector_cosine_ops"),
    ),
  ],
);
