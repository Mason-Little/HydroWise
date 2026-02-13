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
