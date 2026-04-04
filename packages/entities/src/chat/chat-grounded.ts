import { z } from "zod";

export const ChatGroundedInputSchema = z.object({
  query: z.string(),
  retrievedContext: z.array(z.string()),
});

export const ChatGroundedOutputSchema = z.object({
  answer: z.string(),
  queryIndex: z.string(),
});

export type ChatGroundedOutput = z.infer<typeof ChatGroundedOutputSchema>;
export type ChatGroundedInput = z.infer<typeof ChatGroundedInputSchema>;
