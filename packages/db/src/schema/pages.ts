import { index, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { bytea } from "@/types/bytea";
import { documents } from "./documents";

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
    pageEmbedding: vector("page_embedding", { dimensions: 768 }).notNull(),
  },
  (table) => [
    index("pages_embedding_cosine_idx").using(
      "hnsw",
      table.pageEmbedding.op("vector_cosine_ops"),
    ),
  ],
);
