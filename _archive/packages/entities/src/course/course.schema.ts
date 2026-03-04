import { z } from "zod";

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
