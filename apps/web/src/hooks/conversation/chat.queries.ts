import { useMutation, useQuery } from "@tanstack/react-query";
import { chatAPI } from "@/api/conversation/chat";
import { queryClient } from "@/lib/query-client";

export const useChat = () => {
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat"],
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

  return { chats: chats?.data ?? [], isLoading, error, createChat, deleteChat };
};
