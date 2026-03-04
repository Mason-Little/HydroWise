import { create } from "zustand";

interface ChatStore {
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: null,
  setSelectedChatId: (chatId: string | null) => set({ selectedChatId: chatId }),
}));
