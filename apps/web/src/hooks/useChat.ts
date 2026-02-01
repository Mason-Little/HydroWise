import { sendChatCompletion } from "@hydrowise/llm-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  appendMessage,
  createChat,
  deleteChat,
  getChats,
  getMessages,
} from "@/api/chat";
import { useChatStore } from "@/store/chatStore";

export const useChat = () => {
  const queryClient = useQueryClient();
  const {
    activeChatId,
    setActiveChatId,
    streamingContent,
    isStreaming,
    setStreamingContent,
    appendStreamingChunk,
    clearStreaming,
  } = useChatStore();

  const {
    data: chats,
    isLoading: chatsLoading,
    error: chatsError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });

  const createChatMutation = useMutation({
    mutationFn: async () => createChat(),
    onSuccess: (chat) => {
      if (chat?.id) {
        setActiveChatId(chat.id);
      }
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: (_deletedChat, chatId) => {
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", activeChatId],
    queryFn: () => getMessages(activeChatId ?? ""),
    enabled: !!activeChatId,
    staleTime: 1000 * 60 * 5,
  });

  const appendMessageMutation = useMutation({
    mutationFn: ({
      chatId,
      role,
      content,
    }: {
      chatId: string;
      role: "user" | "assistant";
      content: string;
    }) => appendMessage(chatId, role, content),
    onMutate: async ({ chatId, role, content }) => {
      const queryKey = ["messages", chatId] as const;
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: typeof messages | undefined) => [
        ...(old ?? []),
        { role, content },
      ]);
      return { previous, queryKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSuccess: (_message, { chatId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });

  const submitMessage = async (prompt: string) => {
    const chatId =
      activeChatId ?? (await createChatMutation.mutateAsync()).id ?? null;
    if (!activeChatId && chatId) {
      setActiveChatId(chatId);
    }
    if (!chatId) return;

    const history = messages ?? [];

    await appendMessageMutation.mutateAsync({
      chatId,
      role: "user",
      content: prompt,
    });

    setStreamingContent("");
    try {
      const response = await sendChatCompletion(
        [...history, { role: "user", content: prompt }],
        (chunk) => appendStreamingChunk(chunk),
      );

      clearStreaming();
      await appendMessageMutation.mutateAsync({
        chatId,
        role: "assistant",
        content: response,
      });
    } catch (error) {
      clearStreaming();
      throw error;
    }
  };

  return {
    submitMessage,
    chats: chats ?? [],
    chatsLoading,
    chatsError,
    messages,
    messagesLoading,
    messagesError,
    streamingContent,
    isStreaming,
    deleteChatMutation,
    createChatMutation,
    appendMessageMutation,
  };
};
