import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";
import { documentKeys } from "@/lib/query-keys";

export const useTopicDocuments = (topicId: string) => {
  const { data: documents, isLoading } = useQuery({
    queryKey: documentKeys.byTopic(topicId),
    queryFn: () => getQueries().then((q) => q.listDocumentsByTopic(topicId)),
  });

  return { documents, isLoading };
};
