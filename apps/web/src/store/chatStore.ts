import type { Chat } from "@hydrowise/entities";
import { create } from "zustand";

interface ChatStore {
  chat: Chat[];
  activeChatId: string | null;
  createChat: (name?: string) => Chat;
  setActiveChatId: (id: string) => void;
  addMessageId: (chatId: string, messageId: string) => void;
}

const createChatEntity = (name?: string): Chat => ({
  id: crypto.randomUUID(),
  name: name ?? "New Chat",
  messageIds: [],
});

export const useChatStore = create<ChatStore>((set) => ({
  chat: [],
  activeChatId: null,
  createChat: (name) => {
    const chat = createChatEntity(name);
    set((state) => ({ chat: [...state.chat, chat], activeChatId: chat.id }));
    return chat;
  },
  setActiveChatId: (id) => set({ activeChatId: id }),
  addMessageId: (chatId, messageId) => {
    set((state) => ({
      chat: state.chat.map((chat) =>
        chat.id === chatId && !chat.messageIds.includes(messageId)
          ? { ...chat, messageIds: [...chat.messageIds, messageId] }
          : chat,
      ),
    }));
  },
}));
