import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  courseId: z.string(),
  chapterId: z.string(),
  topicId: z.string().nullable(),
});

export const CreateDocumentInputSchema = DocumentSchema.pick({
  name: true,
  description: true,
  courseId: true,
  chapterId: true,
  topicId: true,
});

export type Document = z.infer<typeof DocumentSchema>;
export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;
