import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

const fetchPageById = (pageId: string) =>
  getQueries().then((q) => q.getPageById(pageId));

export const usePageById = (pageId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["pageById", pageId],
    queryFn: () => fetchPageById(pageId),
    enabled: enabled && pageId != null,
  });
};
