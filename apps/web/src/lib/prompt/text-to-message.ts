import type { Message } from "@hydrowise/entities";

export const convertTextToMessage = (
  text: string,
  chatId: string,
  role: "user" | "assistant",
): Message => {
  return {
    role,
    content: text,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    chatId,
  };
};
