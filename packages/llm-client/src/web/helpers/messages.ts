import type { ModelMessage } from "ai";

type ConversationMessageInput = {
  role?: "user" | "assistant";
  content?: string;
};

const SYSTEM_INSTRUCTION_PREFIX =
  "System instructions. Follow these rules for this reply and future replies in this chat:";

export const buildPromptAwareMessages = (
  prompt: string,
  messages: ConversationMessageInput[],
): ModelMessage[] => {
  const instructionMessage: ModelMessage = {
    role: "user",
    content: `${SYSTEM_INSTRUCTION_PREFIX}\n\n${prompt}`,
  };

  return [
    instructionMessage,
    ...messages.map((message): ModelMessage => {
      if (message.role === "assistant") {
        return { role: "assistant", content: message.content ?? "" };
      }

      return { role: "user", content: message.content ?? "" };
    }),
  ];
};
