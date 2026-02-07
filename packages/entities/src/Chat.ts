import { z } from "zod";

export const ChatSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export type Chat = z.infer<typeof ChatSchema>;
