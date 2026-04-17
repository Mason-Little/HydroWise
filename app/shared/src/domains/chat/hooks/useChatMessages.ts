import { getQueries } from "@hydrowise/data";
import type { ChatMessage } from "@hydrowise/entities";
import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/lib/query-keys";

export const useChatMessages = (threadId: string | null) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: chatKeys.messages(threadId ?? "__inactive__"),
    enabled: threadId !== null,
    queryFn: async (): Promise<ChatMessage[]> =>
      (await getQueries()).listChatMessages(threadId as string),
    refetchOnMount: false,
  });

  return { messages, isLoading };
};
