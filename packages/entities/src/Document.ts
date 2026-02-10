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

export const CreateDocumentRequestSchema = DocumentMetaSchema.extend({
  name: z.string(),
  courseId: z.string().nullable(),
  chapterId: z.string().nullable(),
});
export type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>;

export const CreatedDocumentSchema = z.object({
  id: z.string(),
  courseId: z.string().nullable(),
  chapterId: z.string().nullable(),
  name: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
  pageCount: z.number().int().positive().nullable(),
  createdAt: z.string(),
  embeddingCount: z.number().int().nonnegative(),
});

export const GetEmbeddingsChunksRequestSchema = z.object({
  documentIds: z.array(z.string()),
});

export type GetEmbeddingsChunksRequest = z.infer<
  typeof GetEmbeddingsChunksRequestSchema
>;

export const GetEmbeddingsChunksResponseSchema = z.array(EmbeddingChunkSchema);

export type GetEmbeddingsChunksResponse = z.infer<
  typeof GetEmbeddingsChunksResponseSchema
>;

export type CreatedDocument = z.infer<typeof CreatedDocumentSchema>;

export const GetDocumentsResponseSchema = z.array(CreatedDocumentSchema);

export type GetDocumentsResponse = z.infer<typeof GetDocumentsResponseSchema>;

export const CreateDocumentResponseSchema = CreatedDocumentSchema;

export type CreateDocumentResponse = z.infer<
  typeof CreateDocumentResponseSchema
>;
