import { z } from "zod";

export const MessageRoleSchema = z.enum(["user", "assistant"]);

export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageCreateInputSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
});

export type MessageCreateInput = z.infer<typeof MessageCreateInputSchema>;

export const MessageSchema = z.object({
  id: z.string().optional(),
  chatId: z.string().optional(),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  timestamp: z.date().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
