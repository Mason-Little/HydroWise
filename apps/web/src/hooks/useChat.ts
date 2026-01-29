import type { Message } from "@hydrowise/entities";
import type { MLCEngine } from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";
import { createWebLLMEngine } from "@/utils/inference";

const initialMessages: Message[] = [
  {
    order: 0,
    role: "assistant",
    content: "Hello! How can I help you today?",
  },
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [engine, setEngine] = useState<MLCEngine | null>(null);

  useEffect(() => {
    createWebLLMEngine().then((engine) => setEngine(engine));
  }, []);

  const sendMessage = async (message: string) => {
    const userMessage: Message = {
      order: messages.length,
      role: "user",
      content: message,
    };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);

    if (!engine) return;

    const response = await engine.chat.completions.create({
      stream: false,
      messages: newMessages,
      model: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
      max_tokens: 128,
      temperature: 0.6,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        order: prevMessages.length,
        role: "assistant",
        content: response.choices[0].message.content || "",
      },
    ]);
  };

  return {
    messages,
    sendMessage,
  };
};
