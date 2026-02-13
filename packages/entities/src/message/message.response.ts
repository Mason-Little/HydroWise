import { z } from "zod";
import { MessageSchema } from "./message.schema";

export const GetMessagesResponseSchema = z.array(MessageSchema);

export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export const CreateMessageResponseSchema = MessageSchema;

export type CreateMessageResponse = z.infer<typeof CreateMessageResponseSchema>;
