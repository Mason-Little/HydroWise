import { useMemo } from "react";
import { useChat } from "@/hooks/query/chat.queries";
import { useChatStore } from "@/store/chatStore";

export const useChatExists = () => {
  const { chats } = useChat();
  const { selectedChatId } = useChatStore();

  const chatExists = useMemo(() => {
    return chats.filter((chat) => chat.id === selectedChatId).length > 0;
  }, [chats, selectedChatId]);

  return chatExists;
};
