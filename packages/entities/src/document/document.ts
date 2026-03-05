import { z } from "zod";

const supportedFileTypes = z.enum(["pdf", "docx", "pptx", "md", "image"]);

const supportedEmbeddingStatuses = z.enum(["pending", "completed", "failed"]);

export const DocumentSchema = z.object({
  id: z.string(),
  chapterId: z.string(),
  topicId: z.string().nullable(),
  name: z.string(),
  fileType: supportedFileTypes,
  embeddingStatus: supportedEmbeddingStatuses,
});

export const CreateDocumentInputSchema = DocumentSchema.pick({
  chapterId: true,
  topicId: true,
  name: true,
  fileType: true,
});

export type Document = z.infer<typeof DocumentSchema>;
export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;
