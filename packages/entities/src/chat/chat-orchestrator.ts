import { z } from "zod";
import { ChapterSchema } from "../chapter/chapter";

export const ChatHistoryMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string(),
});

export const ChatOrchestratorInputSchema = z.object({
  userMessage: z.string(),
  currentCourse: z.string().nullable(),
  recentMessages: z.array(ChatHistoryMessageSchema),
  workspaceContext: z
    .object({
      courseNmae: z.string(),
      chapters: z.array(
        ChapterSchema.pick({ chapterName: true, chapterDescription: true }),
      ),
    })
    .nullable(),
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
  activeCourse: z.string().nullable(),
  threadTitle: z.string().nullable(),
  toolCall: ChatToolCallSchema,
});

export type ChatOrchestratorInput = z.infer<typeof ChatOrchestratorInputSchema>;
export type ChatOrchestratorOutput = z.infer<
  typeof ChatOrchestratorOutputSchema
>;
