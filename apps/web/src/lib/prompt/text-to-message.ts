import type { MessageRole } from "@hydrowise/entities";

export const convertTextToMessage = (text: string, role: MessageRole) => {
  return {
    role,
    content: text,
  };
};
