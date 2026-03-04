import { z } from "zod";
import { CourseSchema } from "./course.schema";

export const GetCoursesResponseSchema = z.array(CourseSchema);

export type GetCoursesResponse = z.infer<typeof GetCoursesResponseSchema>;

export const GetCourseResponseSchema = CourseSchema;

export type GetCourseResponse = z.infer<typeof GetCourseResponseSchema>;

export const CreateCourseResponseSchema = CourseSchema;

export type CreateCourseResponse = z.infer<typeof CreateCourseResponseSchema>;
