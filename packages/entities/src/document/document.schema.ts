import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.string(),
  courseId: z.string().nullable(),
  chapterId: z.string().nullable(),
  name: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
  embeddingStatus: z.enum(["pending", "completed", "failed"]),
  createdAt: z.string(),
});

export type Document = z.infer<typeof DocumentSchema>;
