import { z } from "zod";

import { GroundedAssistantMessagePayloadSchema } from "./chat-grounded";
import { QuizAssistantMessagePayloadSchema } from "./chat-quiz";

export const UserChatMessagePayloadSchema = z.object({
  kind: z.literal("user-text"),
  text: z.string(),
});

export const ChatMessagePayloadSchema = z.discriminatedUnion("kind", [
  UserChatMessagePayloadSchema,
  GroundedAssistantMessagePayloadSchema,
  QuizAssistantMessagePayloadSchema,
]);

export const ChatMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  role: z.enum(["user", "assistant"]),
  payload: ChatMessagePayloadSchema,
});

export const CreateChatMessageInputSchema = ChatMessageSchema.pick({
  threadId: true,
  role: true,
  payload: true,
});

export type ChatMessagePayload = z.infer<typeof ChatMessagePayloadSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CreateChatMessageInput = z.infer<
  typeof CreateChatMessageInputSchema
>;
