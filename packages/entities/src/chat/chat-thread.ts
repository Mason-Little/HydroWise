import { z } from "zod";

export const ChatThreadSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  courseId: z.string().nullable(),
});

export const PatchChatThreadInputSchema = ChatThreadSchema.omit({
  id: true,
}).partial();

export type ChatThread = z.infer<typeof ChatThreadSchema>;
export type PatchChatThreadInput = z.infer<typeof PatchChatThreadInputSchema>;

export type PatchChatThreadParams = {
  threadId: string;
  patch: PatchChatThreadInput;
};
