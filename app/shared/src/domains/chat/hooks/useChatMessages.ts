import { getQueries } from "@hydrowise/data";
import type { ChatMessage } from "@hydrowise/entities";
import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/lib/query-keys";
import type { ThreadSession } from "@/store/threadStore";

export const useChatMessages = (session: ThreadSession) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey:
      session.status === "active"
        ? chatKeys.messages(session.threadId)
        : ["chat", "messages", session.status],
    enabled: session.status === "active",
    queryFn: async (): Promise<ChatMessage[]> => {
      if (session.status !== "active") {
        return [];
      }

      return (await getQueries()).listChatMessages(session.threadId);
    },
    refetchOnMount: false,
  });

  return { messages, isLoading };
};
