import { z } from "zod";

export const ChatGroundedContextItemSchema = z.object({
  pageId: z.string().uuid(),
  pageContent: z.string(),
});

export const ChatGroundedInputSchema = z.object({
  query: z.string(),
  retrievedContext: z.array(ChatGroundedContextItemSchema),
});

export const ChatGroundedOutputSchema = z.object({
  answer: z.string(),
  sourcePageId: z.string(),
});

export type ChatGroundedContextItem = z.infer<
  typeof ChatGroundedContextItemSchema
>;
export type ChatGroundedOutput = z.infer<typeof ChatGroundedOutputSchema>;
export type ChatGroundedInput = z.infer<typeof ChatGroundedInputSchema>;
