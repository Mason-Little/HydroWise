import { z } from "zod";

export const CourseCreateInputSchema = z.object({
  name: z.string(),
  number: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type CourseCreateInput = z.infer<typeof CourseCreateInputSchema>;
