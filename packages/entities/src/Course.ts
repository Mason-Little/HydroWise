import { z } from "zod";

export const CourseCreateInputSchema = z.object({
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  chapters: z.array(z.string()),
});

const CourseChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
});

export const CourseSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(["active", "inactive"]),
  chapters: z.array(CourseChapterSchema).default([]),
  createdAt: z.union([z.string(), z.date()]).optional(),
});

export type Course = z.infer<typeof CourseSchema>;
export type CourseCreateInput = z.infer<typeof CourseCreateInputSchema>;
