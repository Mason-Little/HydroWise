import { z } from "zod";
export const CreateDocumentRequestSchema = z.object({
  name: z.string(),
  size: z.number().int().positive(),
  mimeType: z.string(),
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
  embeddingStatus: z.enum(["pending", "completed", "failed"]),
  createdAt: z.string(),
});

export type CreatedDocument = z.infer<typeof CreatedDocumentSchema>;

export const GetDocumentsResponseSchema = z.array(CreatedDocumentSchema);

export type GetDocumentsResponse = z.infer<typeof GetDocumentsResponseSchema>;

export const CreateDocumentResponseSchema = CreatedDocumentSchema;

export type CreateDocumentResponse = z.infer<
  typeof CreateDocumentResponseSchema
>;
