import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";
import { topicKeys } from "@/lib/query-keys";

export const useTopics = () => {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: topicKeys.all(),
    queryFn: () => getQueries().then((q) => q.listTopics()),
  });

  return { topics, isLoading };
};

export const useTopicsByChapter = (chapterId: string) => {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: topicKeys.byChapter(chapterId),
    queryFn: () => getQueries().then((q) => q.listTopicsByChapter(chapterId)),
  });

  return { topics, isLoading };
};

export const useTopicsByCourse = (courseId: string) => {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: topicKeys.byCourse(courseId),
    queryFn: () => getQueries().then((q) => q.listTopicsByCourse(courseId)),
  });

  return { topics, isLoading };
};
