import { z } from "zod";

export const ChatThreadSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  courseId: z.string().nullable(),
});

export const CreateChatThreadInputSchema = ChatThreadSchema.omit({ id: true });

export type ChatThread = z.infer<typeof ChatThreadSchema>;
export type CreateChatThreadInput = z.infer<typeof CreateChatThreadInputSchema>;
