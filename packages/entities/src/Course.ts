import { z } from "zod";

export const CourseCreateInputSchema = z.object({
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const CourseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(["active", "inactive"]),
  createdAt: z.union([z.string(), z.date()]),
});

export type Course = z.infer<typeof CourseSchema>;
export type CourseCreateInput = z.infer<typeof CourseCreateInputSchema>;

export const GetCoursesResponseSchema = z.array(CourseSchema);

export type GetCoursesResponse = z.infer<typeof GetCoursesResponseSchema>;

export const GetCourseResponseSchema = CourseSchema;

export type GetCourseResponse = z.infer<typeof GetCourseResponseSchema>;

export const CreateCourseResponseSchema = CourseSchema;

export type CreateCourseResponse = z.infer<typeof CreateCourseResponseSchema>;
