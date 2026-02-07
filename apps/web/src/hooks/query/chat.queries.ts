import type { Chat } from "@hydrowise/entities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatAPI } from "@/api/conversation/chat";
import { queryClient } from "@/lib/query/query-client";
import { makeOptimisticListMutation } from "@/lib/query/query-optimistic";

const chatQueryKey = ["chat"] as const;

export const useChat = () => {
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: chatQueryKey,
    queryFn: () => chatAPI.getAllChats(),
  });

  const { mutateAsync: createChat } = useMutation({
    mutationFn: (chatId: string) => chatAPI.createChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  const { mutateAsync: deleteChat } = useMutation({
    mutationFn: (chatId: string) => chatAPI.deleteChat(chatId),
    ...makeOptimisticListMutation<Chat, string>({
      queryKey: chatQueryKey,
      apply: (current, chatId) => current.filter((chat) => chat.id !== chatId),
    }),
  });

  return { chats: chats?.data ?? [], isLoading, error, createChat, deleteChat };
};
