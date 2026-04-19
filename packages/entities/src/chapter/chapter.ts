import { z } from "zod";

export const ChapterSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  name: z.string(),
  description: z.string(),
});

export const CreateChapterInputSchema = ChapterSchema.pick({
  courseId: true,
  name: true,
  description: true,
});

export type Chapter = z.infer<typeof ChapterSchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterInputSchema>;
