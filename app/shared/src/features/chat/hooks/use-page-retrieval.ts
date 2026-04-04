import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useSearchPages = (embedding: number[]) => {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["searchPages", embedding],
    queryFn: () => getQueries().then((q) => q.searchPages(embedding)),
  });

  return { pages, isLoading };
};
