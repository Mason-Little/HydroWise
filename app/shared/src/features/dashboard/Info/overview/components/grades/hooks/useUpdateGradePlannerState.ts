import { getQueries } from "@hydrowise/data";
import type { GradePlannerState } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseRow } from "@/features/dashboard/dashboard-context";
import { replaceCoursePlannerState } from "@/features/dashboard/Info/overview/components/grades/lib/planner-state";
import { courseKeys } from "@/lib/query-keys";

type GradePlannerMutationContext = {
  previousCourses: CourseRow[];
};

export const useUpdateGradePlannerState = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    CourseRow,
    Error,
    GradePlannerState,
    GradePlannerMutationContext
  >({
    mutationFn: (plannerState) =>
      getQueries().then((queries) =>
        queries.updateGradePlannerState(courseId, plannerState),
      ),
    onMutate: async (plannerState) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.all() });

      const previousCourses =
        queryClient.getQueryData<CourseRow[]>(courseKeys.all()) ?? [];
      queryClient.setQueryData<CourseRow[]>(courseKeys.all(), (courses = []) =>
        replaceCoursePlannerState(courses, courseId, plannerState),
      );

      return { previousCourses };
    },
    onError: (_error, _plannerState, context) => {
      queryClient.setQueryData(courseKeys.all(), context?.previousCourses ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all() });
    },
  });
};
