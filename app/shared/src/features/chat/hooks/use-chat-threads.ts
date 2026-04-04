import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useChatThreads = () => {
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["chatThreads"],
    queryFn: () => getQueries().then((q) => q.listChatThreads()),
  });

  return { threads, isLoading };
};
