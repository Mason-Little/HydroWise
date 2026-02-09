import type { Chat } from "@hydrowise/entities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatAPI } from "@/api/conversation/chat";
import { queryClient } from "@/lib/query/query-client";

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
    mutationFn: () => chatAPI.createChat(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  const { mutateAsync: deleteChat } = useMutation({
    mutationFn: (chatId: string) => chatAPI.deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  const chatList: Chat[] = chats?.data ?? [];

  return { chats: chatList, isLoading, error, createChat, deleteChat };
};
