import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { create } from "zustand";

interface MessageStore {
  messages: ChatCompletionMessageParam[];
  addMessage: (message: ChatCompletionMessageParam) => void;
  setMessages: (messages: ChatCompletionMessageParam[]) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ],
  addMessage: (message: ChatCompletionMessageParam) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: ChatCompletionMessageParam[]) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}));
