import { getQueries } from "@hydrowise/data";
import type { CourseDetails } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCourseDetails = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<CourseDetails>) =>
      getQueries().then((q) => q.updateCourseDetails(courseId, patch)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
