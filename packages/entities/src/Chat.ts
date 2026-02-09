import { z } from "zod";

const ChatIdSchema = z.string().min(1);

export const ChatCreateInputSchema = z.object({
  name: z.string().min(1).optional(),
});

export const ChatSchema = z.object({
  id: ChatIdSchema,
  userId: z.string().min(1),
  name: z.string(),
  createdAt: z.union([z.string(), z.date()]),
});

export type Chat = z.infer<typeof ChatSchema>;
export type ChatCreateInput = z.infer<typeof ChatCreateInputSchema>;

export const GetChatsResponseSchema = z.object({
  data: z.array(ChatSchema),
});

export type GetChatsResponse = z.infer<typeof GetChatsResponseSchema>;

export const CreateChatResponseSchema = z.object({
  data: ChatSchema,
});

export type CreateChatResponse = z.infer<typeof CreateChatResponseSchema>;
