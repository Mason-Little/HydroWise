import { getQueries } from "@hydrowise/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChatThreads = () => {
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["chatThreads"],
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
      queryClient.invalidateQueries({ queryKey: ["chatThreads"] });
    },
  });
};
