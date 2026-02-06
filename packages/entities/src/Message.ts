import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string().optional(),
  chatId: z.string().optional(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  timestamp: z.date().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
