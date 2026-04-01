import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";

export const useCourses = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getQueries().then((q) => q.listCourses()),
  });

  return { courses, isLoading, isError };
};
