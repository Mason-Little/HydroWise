import { z } from "zod";

export const ChapterSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  chapterName: z.string(),
  chapterDescription: z.string(),
});

export const CreateChapterInputSchema = ChapterSchema.pick({
  courseId: true,
  chapterName: true,
  chapterDescription: true,
});

export type Chapter = z.infer<typeof ChapterSchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterInputSchema>;
