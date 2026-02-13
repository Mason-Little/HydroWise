import { z } from "zod";

export const DocumentCreateInputSchema = z.object({
  name: z.string(),
  size: z.number().int().positive(),
  mimeType: z.string(),
  courseId: z.string().nullable(),
  chapterId: z.string().nullable(),
});

export type DocumentCreateInput = z.infer<typeof DocumentCreateInputSchema>;
