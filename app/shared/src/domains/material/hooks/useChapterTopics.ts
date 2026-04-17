import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";
import { topicKeys } from "@/lib/query-keys";

export const useChapterTopics = (chapterId: string) => {
  const { data: topics, isLoading } = useQuery({
    queryKey: topicKeys.byChapter(chapterId),
    queryFn: () => getQueries().then((q) => q.listTopicsByChapter(chapterId)),
  });

  return { topics, isLoading };
};
