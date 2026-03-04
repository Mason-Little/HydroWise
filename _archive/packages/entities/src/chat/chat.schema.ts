import { z } from "zod";

const ChatIdSchema = z.string().min(1);

export const ChatSchema = z.object({
  id: ChatIdSchema,
  userId: z.string().min(1),
  name: z.string(),
  createdAt: z.union([z.string(), z.date()]),
});

export type Chat = z.infer<typeof ChatSchema>;
