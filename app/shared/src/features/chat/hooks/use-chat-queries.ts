import { getQueries } from "@hydrowise/data";
import { useMutation, useQuery } from "@tanstack/react-query";

export const chatQueryKeys = {
  threads: ["chatThreads"] as const,
  messages: (threadId: string | null) => ["chatMessages", threadId] as const,
};

export const useChatThreads = () => {
  const {
    data: threads = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: chatQueryKeys.threads,
    queryFn: () => getQueries().then((q) => q.listChatThreads()),
  });

  return { threads, isLoading, isError };
};

export const useChatMessages = (threadId: string | null) => {
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: chatQueryKeys.messages(threadId),
    queryFn: async () => {
      if (threadId === null) return [];
      return (await getQueries()).listChatMessages(threadId);
    },
    enabled: threadId !== null,
  });

  return { messages, isLoading, isError };
};

export type CreateUserTextMessageInput = { threadId: string; text: string };

export const useCreateUserTextMessageMutation = () =>
  useMutation({
    mutationFn: async (input: CreateUserTextMessageInput) => {
      const queries = await getQueries();
      await queries.createChatMessage({
        threadId: input.threadId,
        role: "user",
        payload: { kind: "user-text", text: input.text },
      });
    },
  });
