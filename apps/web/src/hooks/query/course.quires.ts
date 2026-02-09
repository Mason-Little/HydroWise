import type { CourseCreateInput } from "@hydrowise/entities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { courseAPI } from "@/api/course/course";
import { queryClient } from "@/lib/query/query-client";

export const useCourses = () => {
  const { data: courses } = useQuery({
    queryKey: ["course"],
    queryFn: () => courseAPI.getCourses(),
  });

  const { mutateAsync: createCourse } = useMutation({
    mutationFn: (course: CourseCreateInput) => courseAPI.createCourse(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });

  return {
    createCourse,
    courses: courses ?? [],
  };
};
