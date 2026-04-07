import { getQueries } from "@hydrowise/data";
import type { ChatMessage } from "@hydrowise/entities";
import { useQuery } from "@tanstack/react-query";

export const useChatMessages = (threadId: string | null) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chatMessages", threadId],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (threadId === null) return [];
      return (await getQueries()).listChatMessages(threadId);
    },
    enabled: threadId !== null,
    refetchOnMount: false,
  });

  return { messages, isLoading };
};
