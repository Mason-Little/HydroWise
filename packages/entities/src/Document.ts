import { z } from "zod";

export const EmbeddingChunkSchema = z.object({
  content: z.string(),
  embedding: z.array(z.number()),
});

export type EmbeddingChunk = z.infer<typeof EmbeddingChunkSchema>;

export const DocumentMetaSchema = z.object({
  name: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
  pageCount: z.number().int().positive().nullable().optional(),
  embeddings: z.array(EmbeddingChunkSchema),
});

export type DocumentMeta = z.infer<typeof DocumentMetaSchema>;

export const CreateDocumentRequestSchema = DocumentMetaSchema;
export type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>;

export const CreatedDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
  pageCount: z.number().int().positive().nullable(),
  createdAt: z.string(),
  embeddingCount: z.number().int().nonnegative(),
});

export type CreatedDocument = z.infer<typeof CreatedDocumentSchema>;

export const CreateDocumentResponseSchema = z.object({
  data: CreatedDocumentSchema,
});

export type CreateDocumentResponse = z.infer<
  typeof CreateDocumentResponseSchema
>;
