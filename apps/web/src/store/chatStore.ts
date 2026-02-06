import { create } from "zustand";

interface ChatStore {
  selectedChatId: string | undefined;
  setSelectedChatId: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: undefined,
  setSelectedChatId: (chatId: string) => set({ selectedChatId: chatId }),
}));
