import { z } from "zod";
import { ChapterSchema } from "../chapter/chapter";

export const ChatHistoryMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string(),
});

export type ChatHistoryMessage = z.infer<typeof ChatHistoryMessageSchema>;

export const WorkspaceContextItemSchema = z.object({
  courseId: z.string(),
  courseName: z.string(),
  chapters: z.array(
    ChapterSchema.pick({ chapterName: true, chapterDescription: true }),
  ),
});

export const ChatOrchestratorInputSchema = z.object({
  userMessage: z.string(),
  recentMessages: z.array(ChatHistoryMessageSchema),
  workspaceContext: z.array(WorkspaceContextItemSchema).nullable(),
  isFirstTurn: z.boolean(),
});

export const GroundedAnswerToolArgsSchema = z.object({
  userQuery: z
    .string()
    .min(1)
    .describe(
      "The user's request rewritten only if needed for the grounded-response tool.",
    ),
  retrievalQuery: z
    .string()
    .min(1)
    .describe(
      "A short semantic-search query for retrieval. Focus on the topic keywords, not a full sentence.",
    ),
});

export const GroundedAnswerToolCallSchema = z.object({
  toolName: z.literal("grounded-response"),
  args: GroundedAnswerToolArgsSchema,
});

export const ChatToolCallSchema = z.discriminatedUnion("toolName", [
  GroundedAnswerToolCallSchema,
]);

export const ChatOrchestratorOutputSchema = z.object({
  activeCourse: z
    .string()
    .describe(
      "Active course id. Must be copied exactly from a workspaceContext.courseId UUID, never from courseName. Only when isFirstTurn is true and there is a clear course match.",
    ),

  threadTitle: z
    .string()
    .describe(
      "Thread title. Short, student-facing, about 2 to 5 words. Only when isFirstTurn is true and the user message is specific enough.",
    ),

  toolCall: ChatToolCallSchema,
});

export type WorkspaceContextItem = z.infer<typeof WorkspaceContextItemSchema>;
export type ChatOrchestratorInput = z.infer<typeof ChatOrchestratorInputSchema>;
export type ChatOrchestratorOutput = z.infer<
  typeof ChatOrchestratorOutputSchema
>;
