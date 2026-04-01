import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useChapterTopics = (chapterId: string) => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics", chapterId],
    queryFn: () => getQueries().then((q) => q.listTopicsByChapter(chapterId)),
  });
  return { topics, isLoading };
};
