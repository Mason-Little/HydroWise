import { sendChatCompletion } from "@hydrowise/llm-client";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { useMessageStore } from "@/store/messageStore";

export const useChat = () => {
  const { messages, addMessage, setMessages } = useMessageStore();

  const submitMessage = async (message: string) => {
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: message,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    console.log("Sending message", nextMessages);

    const response = await sendChatCompletion(nextMessages);
    addMessage({
      role: "assistant",
      content: response,
    });
  };

  return {
    submitMessage,
    messages,
  };
};
