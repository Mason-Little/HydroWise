import { z } from "zod";

export const ChatCitationRefSchema = z.object({
  kind: z.literal("citation"),
  documentId: z.string(),
  pageNumber: z.number(),
  excerpt: z.string().nullable(),
});

export const ChatArtifactRefSchema = z.object({
  kind: z.literal("artifact"),
  artifactType: z.enum(["quiz"]),
  artifactId: z.string(),
  label: z.string(),
});

export const ChatRefSchema = z.discriminatedUnion("kind", [
  ChatCitationRefSchema,
  ChatArtifactRefSchema,
]);

export const UserChatMessagePayloadSchema = z.object({
  kind: z.literal("user-text"),
  text: z.string(),
});

export const GroundedAssistantMessagePayloadSchema = z.object({
  kind: z.literal("grounded-answer"),
  text: z.string(),
  refs: z.array(ChatCitationRefSchema),
});

export const ArtifactAssistantMessagePayloadSchema = z.object({
  kind: z.literal("artifact-created"),
  text: z.string(),
  refs: z.array(ChatArtifactRefSchema),
});

export const ChatMessagePayloadSchema = z.discriminatedUnion("kind", [
  UserChatMessagePayloadSchema,
  GroundedAssistantMessagePayloadSchema,
  ArtifactAssistantMessagePayloadSchema,
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

export type ChatRef = z.infer<typeof ChatRefSchema>;
export type ChatMessagePayload = z.infer<typeof ChatMessagePayloadSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CreateChatMessageInput = z.infer<
  typeof CreateChatMessageInputSchema
>;
