import { z } from "zod";

export const ChatSchema = z.object({
  name: z.string(),
  id: z.string(),
  messageIds: z.array(z.string()),
});

export type Chat = z.infer<typeof ChatSchema>;
