import { getQueries } from "@hydrowise/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/lib/query-keys";

export const useChatThreads = () => {
  const { data: threads = [], isLoading } = useQuery({
    queryKey: chatKeys.threads(),
    queryFn: () => getQueries().then((q) => q.listChatThreads()),
  });
  const { mutate: deleteChatThread } = useDeleteChatThread();

  return { threads, isLoading, deleteChatThread };
};

export const useDeleteChatThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const { deleteChatThread } = await getQueries();
      await deleteChatThread(threadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
    },
  });
};
