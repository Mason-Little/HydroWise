import {
  createWebLLMEngine,
  sendChatCompletion,
  type WebLLMEngine,
} from "@hydrowise/llm-client";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";
import { useMessageStore } from "@/store/messageStore";

export const useChat = () => {
  const { messages, addMessage, setMessages } = useMessageStore();
  const [engine, setEngine] = useState<WebLLMEngine | null>(null);

  useEffect(() => {
    createWebLLMEngine().then((nextEngine: WebLLMEngine) =>
      setEngine(nextEngine),
    );
  }, []);

  const submitMessage = async (message: string) => {
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: message,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    if (!engine) return;

    console.log("Sending message", nextMessages);

    const response = await sendChatCompletion(engine, nextMessages);
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
