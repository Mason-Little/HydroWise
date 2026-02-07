import { create } from "zustand";

interface ChatStore {
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: crypto.randomUUID(),
  setSelectedChatId: (chatId: string) => set({ selectedChatId: chatId }),
}));
