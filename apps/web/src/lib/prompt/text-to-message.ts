import type { Message, MessageRole } from "@hydrowise/entities";

export const convertTextToMessage = (
  text: string,
  chatId: string,
  role: MessageRole,
): Message => {
  return {
    role,
    content: text,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    chatId,
  };
};
