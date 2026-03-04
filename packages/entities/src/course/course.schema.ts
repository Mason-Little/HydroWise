import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;
