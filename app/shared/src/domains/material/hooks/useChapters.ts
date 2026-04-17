import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";
import { chapterKeys } from "@/lib/query-keys";

export const useChapters = (courseId: string) => {
  const { data: chapters = [], isLoading } = useQuery({
    queryKey: chapterKeys.byCourse(courseId),
    queryFn: () => getQueries().then((q) => q.listChaptersByCourse(courseId)),
  });

  return { chapters, isLoading };
};
