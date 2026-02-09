import { z } from "zod";

export const MessageRoleSchema = z.enum(["user", "assistant"]);

export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const ConversationMessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
});

export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;

export const MessageCreateInputSchema = ConversationMessageSchema;

export type MessageCreateInput = ConversationMessage;

export const MessageSchema = z.object({
  id: z.string().min(1),
  chatId: z.string().min(1),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.union([z.string(), z.date()]),
});

export type Message = z.infer<typeof MessageSchema>;

export const GetMessagesResponseSchema = z.array(MessageSchema);

export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export const CreateMessageResponseSchema = MessageSchema;

export type CreateMessageResponse = z.infer<typeof CreateMessageResponseSchema>;
