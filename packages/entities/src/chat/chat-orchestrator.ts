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
});

export const GroundedAnswerToolArgsSchema = z.object({
  userQuery: z.string(),
  retrievalQuery: z.string(),
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
    .optional()
    .describe(
      "Workspace course id when assigning or changing thread course; omit if course is already correct in context (do not restate an existing choice).",
    ),
  threadTitle: z
    .string()
    .optional()
    .describe(
      "Short thread title when naming or retitling; omit if a title is already established in context (do not restate).",
    ),
  toolCall: ChatToolCallSchema,
});

export type WorkspaceContextItem = z.infer<typeof WorkspaceContextItemSchema>;
export type ChatOrchestratorInput = z.infer<typeof ChatOrchestratorInputSchema>;
export type ChatOrchestratorOutput = z.infer<
  typeof ChatOrchestratorOutputSchema
>;
