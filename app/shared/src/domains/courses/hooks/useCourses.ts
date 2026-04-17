import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";
import { courseKeys } from "@/lib/query-keys";

export const useCourses = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: courseKeys.all(),
    queryFn: () => getQueries().then((q) => q.listCourses()),
  });

  return { courses, isLoading, isError };
};
