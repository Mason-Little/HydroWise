import { z } from "zod";

import { ChatCitationRefSchema } from "./chat-refs";

export const ChatGroundedContextItemSchema = z.object({
  pageId: z.string().uuid(),
  pageContent: z.string(),
});

export const ChatGroundedInputSchema = z.object({
  query: z.string(),
  retrievedContext: z.array(ChatGroundedContextItemSchema),
});

export const GroundedAssistantMessageStreamSchema = z.object({
  text: z.string().default(""),
  refs: z.array(ChatCitationRefSchema.partial()).default([]),
});

export const GroundedAssistantMessageDraftSchema =
  GroundedAssistantMessageStreamSchema.transform((value) => ({
    kind: "grounded-answer" as const,
    text: value.text,
    refs: value.refs,
  }));

export const GroundedAssistantMessagePayloadSchema = z.object({
  kind: z.literal("grounded-answer"),
  text: z.string(),
  refs: z.array(ChatCitationRefSchema),
});

export type ChatGroundedContextItem = z.infer<
  typeof ChatGroundedContextItemSchema
>;
export type ChatGroundedInput = z.infer<typeof ChatGroundedInputSchema>;
export type GroundedAssistantMessageStream = z.infer<
  typeof GroundedAssistantMessageStreamSchema
>;
export type GroundedAssistantMessageDraft = z.infer<
  typeof GroundedAssistantMessageDraftSchema
>;
export type GroundedAssistantMessagePayload = z.infer<
  typeof GroundedAssistantMessagePayloadSchema
>;
