import { z } from "zod";

export const QuizPlannerPageAbstractSchema = z.object({
  pageNumber: z.number(),
  abstract: z.string(),
});

export const QuizPlannerDocumentSchema = z.object({
  name: z.string(),
  description: z.string(),
  pageAbstracts: z.array(QuizPlannerPageAbstractSchema),
});

export const QuizPlannerTopicSchema = z.object({
  name: z.string(),
  description: z.string(),
  documents: z.array(QuizPlannerDocumentSchema),
});

export const QuizPlannerChapterSchema = z.object({
  chapterName: z.string(),
  description: z.string(),
  topics: z.array(QuizPlannerTopicSchema),
});

export const QuizPlannerTreeSchema = z.object({
  chapters: z.array(QuizPlannerChapterSchema),
});

export type QuizPlannerPageAbstract = z.infer<
  typeof QuizPlannerPageAbstractSchema
>;
export type QuizPlannerDocument = z.infer<typeof QuizPlannerDocumentSchema>;
export type QuizPlannerTopic = z.infer<typeof QuizPlannerTopicSchema>;
export type QuizPlannerChapter = z.infer<typeof QuizPlannerChapterSchema>;
export type QuizPlannerTree = z.infer<typeof QuizPlannerTreeSchema>;
