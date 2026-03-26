import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useChapters = (courseId: string) => {
  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: () => getQueries().then((q) => q.listChaptersByCourse(courseId)),
  });

  return { chapters, isLoading };
};
