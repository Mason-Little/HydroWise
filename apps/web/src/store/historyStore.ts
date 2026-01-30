import type { Message } from "@hydrowise/entities";
import { create } from "zustand";
import { useChatStore } from "@/store/chatStore";

interface HistoryStore {
  history: Message[];
  addHistory: (
    prompt: string,
    role: "user" | "assistant",
    chatId: string,
  ) => Message;
  getHistory: (chatId: string) => Message[];
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],
  addHistory: (prompt, role, chatId) => {
    const historyEntry: Message = {
      id: crypto.randomUUID(),
      chatId,
      role,
      content: prompt,
    };

    set((state) => ({
      history: [...state.history, historyEntry],
    }));
    useChatStore.getState().addMessageId(chatId, historyEntry.id);
    return historyEntry;
  },
  getHistory: (chatId: string) => {
    const { history } = get();
    return history.filter((message) => message.chatId === chatId);
  },
}));
