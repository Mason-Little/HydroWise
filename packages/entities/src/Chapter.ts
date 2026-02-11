import { z } from "zod";

export const ChapterSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  courseId: z.string().min(1),
  name: z.string(),
  order: z.number(),
  createdAt: z.union([z.string(), z.date()]),
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const ChapterCreateInputSchema = z.object({
  name: z.string(),
  courseId: z.string().min(1),
});

export type ChapterCreateInput = z.infer<typeof ChapterCreateInputSchema>;

export const GetChaptersResponseSchema = z.array(ChapterSchema);

export type GetChaptersResponse = z.infer<typeof GetChaptersResponseSchema>;

export const GetChapterResponseSchema = ChapterSchema;

export type GetChapterResponse = z.infer<typeof GetChapterResponseSchema>;

export const CreateChapterResponseSchema = ChapterSchema;

export type CreateChapterResponse = z.infer<typeof CreateChapterResponseSchema>;
