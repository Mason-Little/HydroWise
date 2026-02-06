import type { Message } from "@hydrowise/entities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatAPI } from "@/api/conversation/chat";
import { queryClient } from "@/lib/query-client";

export const useMessages = (chatId: string) => {
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat", chatId, "messages"],
    queryFn: () => chatAPI.getChatMessages(chatId),
  });

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: (message: string) =>
      chatAPI.sendMessage(chatId, message as unknown as Message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId, "messages"] });
    },
  });

  return { messages: messages?.data ?? [], isLoading, error, sendMessage };
};
