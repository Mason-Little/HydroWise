import type { ChatMessage } from "@hydrowise/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatAPI } from "@/api/conversation/chat";
import { useChatStore } from "@/store/chatStore";

export const useMessages = () => {
  const queryClient = useQueryClient();
  const { selectedChatId } = useChatStore();
  const messagesQueryKey = ["chat", selectedChatId, "messages"] as const;

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: messagesQueryKey,
    queryFn: () => {
      if (!selectedChatId) {
        throw new Error("No active chat selected");
      }
      return chatAPI.getChatMessages(selectedChatId);
    },
    enabled: Boolean(selectedChatId),
  });

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: ({
      chatId,
      message,
    }: {
      chatId: string;
      message: ChatMessage;
    }) => chatAPI.sendMessage(chatId, message),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", variables.chatId, "messages"],
      });
    },
  });

  const sendChatMessage = (chatId: string, message: ChatMessage) => {
    return sendMessage({ chatId, message });
  };

  return {
    messages: messages ?? [],
    isLoading,
    error,
    sendMessage: sendChatMessage,
  };
};
