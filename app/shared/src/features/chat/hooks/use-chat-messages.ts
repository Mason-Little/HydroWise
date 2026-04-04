import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useChatMessages = (threadId: string | null) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chatMessages", threadId],
    queryFn: async () => {
      if (threadId === null) return [];
      return (await getQueries()).listChatMessages(threadId);
    },
    enabled: threadId !== null,
  });

  return { messages, isLoading };
};
