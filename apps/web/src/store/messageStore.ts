import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { create } from "zustand";

interface MessageStore {
  history: ChatCompletionMessageParam[];
  addMessage: (message: ChatCompletionMessageParam) => void;
  setHistory: (history: ChatCompletionMessageParam[]) => void;
  clearHistory: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  history: [],
  addMessage: (message: ChatCompletionMessageParam) =>
    set((state) => ({ history: [...state.history, message] })),
  setHistory: (history: ChatCompletionMessageParam[]) => set({ history }),
  clearHistory: () => set({ history: [] }),
}));
