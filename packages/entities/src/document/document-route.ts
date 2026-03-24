import { z } from "zod";
import { CreateChapterInputSchema } from "../chapter/chapter";
import { CreateTopicInputSchema } from "../topic/topic";

export const DocumentRouteChapterPickSchema = z.discriminatedUnion("pick", [
  z.object({
    pick: z.literal("match"),
    chapterName: z.string().min(1),
  }),
  z.object({
    pick: z.literal("create"),
    chapter: CreateChapterInputSchema.omit({ courseId: true }),
  }),
]);

export const DocumentRouteTopicPickSchema = z.discriminatedUnion("pick", [
  z.object({
    pick: z.literal("match"),
    name: z.string().min(1),
  }),
  z.object({
    pick: z.literal("create"),
    topic: CreateTopicInputSchema.omit({ chapterId: true }),
  }),
]);

export const DocumentRouteUnroutableReasonSchema = z.enum([
  "no-course-match",
  "insufficient-context",
]);

export const DocumentRouteSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    title: z.string().min(1),
    description: z.string().min(1),
    courseCode: z.string().min(1),
    chapter: DocumentRouteChapterPickSchema,
    topic: DocumentRouteTopicPickSchema,
  }),
  z.object({
    status: z.literal("unroutable"),
    reason: DocumentRouteUnroutableReasonSchema,
  }),
]);

export type DocumentRoute = z.infer<typeof DocumentRouteSchema>;
