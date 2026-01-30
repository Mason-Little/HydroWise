import { sendChatCompletion } from "@hydrowise/llm-client";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { useMessageStore } from "@/store/messageStore";

export const useChat = () => {
  const { history, addMessage } = useMessageStore();

  const submitMessage = async (prompt: string) => {
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: prompt,
    };

    addMessage(userMessage);

    const response = await sendChatCompletion(history, userMessage);

    addMessage({
      role: "assistant",
      content: response,
    });
  };

  return {
    submitMessage,
    history,
  };
};
