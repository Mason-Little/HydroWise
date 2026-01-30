import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;
