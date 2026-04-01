import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useChapterDocuments = (chapterId: string) => {
  const { data: documents, isPending } = useQuery({
    queryKey: ["documents", "byChapter", chapterId],
    queryFn: () =>
      getQueries().then((q) => q.listDocumentsByChapter(chapterId)),
    enabled: chapterId.length > 0,
  });
  return { documents, isPending };
};
