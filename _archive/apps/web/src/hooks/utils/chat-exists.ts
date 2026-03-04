import { useChat } from "@/hooks/query/chat.queries";
import { useChatStore } from "@/store/chatStore";

export const chatExists = () => {
  const { chats } = useChat();
  const { selectedChatId } = useChatStore();

  if (!selectedChatId) {
    return false;
  }

  return chats.filter((chat) => chat.id === selectedChatId).length > 0;
};
