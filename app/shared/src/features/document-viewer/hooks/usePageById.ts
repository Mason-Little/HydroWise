import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

const fetchPageById = (pageId: string) =>
  getQueries().then((q) => q.getPageById(pageId));

export const usePageById = (pageId: string) => {
  return useQuery({
    queryKey: ["pageById", pageId],
    queryFn: () => fetchPageById(pageId),
  });
};
