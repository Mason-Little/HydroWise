import type { Chat } from "@hydrowise/entities";
import { create } from "zustand";

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  createChat: (name?: string) => Chat;
  setActiveChatId: (id: string) => void;
  addMessageId: (chatId: string, messageId: string) => void;
  deleteChat: (chatId: string) => void;
}

const createChatEntity = (name?: string): Chat => ({
  id: crypto.randomUUID(),
  name: name ?? "New Chat",
  messageIds: [],
});

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  activeChatId: null,
  createChat: (name) => {
    const chat = createChatEntity(name);
    set((state) => ({ chats: [...state.chats, chat], activeChatId: chat.id }));
    return chat;
  },
  setActiveChatId: (id) => set({ activeChatId: id }),
  addMessageId: (chatId, messageId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId && !chat.messageIds.includes(messageId)
          ? { ...chat, messageIds: [...chat.messageIds, messageId] }
          : chat,
      ),
    }));
  },
  deleteChat: (chatId) => {
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
    }));
  },
}));
