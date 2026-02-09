import { z } from "zod";

export const CourseCreateInputSchema = z.object({
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  chapters: z.array(z.string()),
});

export const CourseChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
});

export type CourseChapter = z.infer<typeof CourseChapterSchema>;

export const CourseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(["active", "inactive"]),
  chapters: z.array(CourseChapterSchema).default([]),
  createdAt: z.union([z.string(), z.date()]),
});

export type Course = z.infer<typeof CourseSchema>;
export type CourseCreateInput = z.infer<typeof CourseCreateInputSchema>;

export const GetCoursesResponseSchema = z.object({
  data: z.array(CourseSchema),
});

export type GetCoursesResponse = z.infer<typeof GetCoursesResponseSchema>;

export const CreateCourseResponseSchema = z.object({
  data: CourseSchema,
});

export type CreateCourseResponse = z.infer<typeof CreateCourseResponseSchema>;
