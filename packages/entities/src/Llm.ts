import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);
const ChunkIndexSchema = z.number().int().nonnegative();

export const ChunkIdeaResultSchema = z.object({
  idea: NonEmptyStringSchema,
});

export type ChunkIdeaResult = z.infer<typeof ChunkIdeaResultSchema>;

export const TopicAssessmentInputChunkSchema = z.object({
  chunkIndex: ChunkIndexSchema,
  chunkIdea: NonEmptyStringSchema,
});

export type TopicAssessmentInputChunk = z.infer<
  typeof TopicAssessmentInputChunkSchema
>;

export const TopicAssessmentCreateTopicSchema = z.object({
  name: NonEmptyStringSchema,
  description: NonEmptyStringSchema,
});

export type TopicAssessmentCreateTopic = z.infer<
  typeof TopicAssessmentCreateTopicSchema
>;

export const TopicAssessmentAssignmentSchema = z.object({
  chunkIndex: ChunkIndexSchema,
  topicName: NonEmptyStringSchema,
  confidence: z.number().min(0).max(1),
});

export type TopicAssessmentAssignment = z.infer<
  typeof TopicAssessmentAssignmentSchema
>;

export const TopicAssessmentResultSchema = z.object({
  createTopics: z.array(TopicAssessmentCreateTopicSchema),
  assignments: z.array(TopicAssessmentAssignmentSchema),
});

export type TopicAssessmentResult = z.infer<typeof TopicAssessmentResultSchema>;
