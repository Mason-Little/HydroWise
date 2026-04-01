import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useTopicDocuments = (topicId: string) => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", "byTopic", topicId],
    queryFn: () => getQueries().then((q) => q.listDocumentsByTopic(topicId)),
  });
  return { documents, isLoading };
};
