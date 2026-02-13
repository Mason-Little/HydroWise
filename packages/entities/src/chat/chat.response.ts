import { z } from "zod";
import { ChatSchema } from "./chat.schema";

export const GetChatsResponseSchema = z.array(ChatSchema);

export type GetChatsResponse = z.infer<typeof GetChatsResponseSchema>;

export const CreateChatResponseSchema = ChatSchema;

export type CreateChatResponse = z.infer<typeof CreateChatResponseSchema>;
