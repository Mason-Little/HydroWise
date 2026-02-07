import type { Message } from "@hydrowise/entities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatAPI } from "@/api/conversation/chat";
import { makeOptimisticListMutation } from "@/lib/query-optimistic";
import { useChatStore } from "@/store/chatStore";

export const useMessages = () => {
  const { selectedChatId } = useChatStore();
  const messagesQueryKey = ["chat", selectedChatId, "messages"] as const;

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: messagesQueryKey,
    queryFn: () => chatAPI.getChatMessages(selectedChatId || ""),
    enabled: Boolean(selectedChatId),
  });

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: (message: Message) =>
      chatAPI.sendMessage(selectedChatId || "", message),
    ...makeOptimisticListMutation<Message, Message>({
      queryKey: messagesQueryKey,
      apply: (current, message) => [...current, message],
    }),
  });

  return { messages: messages?.data ?? [], isLoading, error, sendMessage };
};
