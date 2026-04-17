import { getQueries } from "@hydrowise/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prependThreadInCache } from "@/domains/chat/chat-send-message-cache";

export const useCreateChatThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { createChatThread } = await getQueries();
      return createChatThread();
    },
    onSuccess: (thread) => {
      prependThreadInCache(queryClient, thread);
    },
  });
};
