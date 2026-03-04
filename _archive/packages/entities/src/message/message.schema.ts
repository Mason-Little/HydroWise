import { z } from "zod";

export const MessageRoleSchema = z.enum(["user", "assistant"]);

export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const ChatMessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const MessageSchema = z.object({
  id: z.string().min(1),
  chatId: z.string().min(1),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.union([z.string(), z.date()]),
});

export type Message = z.infer<typeof MessageSchema>;
