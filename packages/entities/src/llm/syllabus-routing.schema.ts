import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const SyllabusRoutingResultSchema = z.union([
  z.object({
    isSyllabus: z.literal(true),
    courseId: z.null(),
  }),
  z.object({
    isSyllabus: z.literal(false),
    courseId: NonEmptyStringSchema,
  }),
]);

export type SyllabusRoutingResult = z.infer<typeof SyllabusRoutingResultSchema>;
