import { z } from "zod";

export const ChatGroundedContextItemSchema = z.object({
  pageId: z.string().uuid(),
  pageContent: z.string(),
});

export const ChatGroundedInputSchema = z.object({
  query: z.string(),
  retrievedContext: z.array(ChatGroundedContextItemSchema),
});

export const GroundedAssistantCitationPayloadSchema = z.object({
  kind: z.literal("citation").default("citation"),
  pageId: z.string().uuid().optional(),
  excerpt: z.string().nullable().optional(),
});

export const GroundedAssistantMessagePayloadSchema = z.object({
  kind: z.literal("grounded-answer").default("grounded-answer"),
  text: z.string().default(""),
  refs: z.array(GroundedAssistantCitationPayloadSchema).default([]),
});

export type ChatGroundedContextItem = z.infer<
  typeof ChatGroundedContextItemSchema
>;
export type ChatGroundedInput = z.infer<typeof ChatGroundedInputSchema>;
export type GroundedAssistantMessagePayload = z.infer<
  typeof GroundedAssistantMessagePayloadSchema
>;
export type GroundedAssistantCitationPayload = z.infer<
  typeof GroundedAssistantCitationPayloadSchema
>;
