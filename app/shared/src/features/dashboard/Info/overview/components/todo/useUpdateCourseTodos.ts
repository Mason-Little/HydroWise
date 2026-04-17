import { getQueries } from "@hydrowise/data";
import type { CourseTodoItem } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseRow } from "@/features/dashboard/dashboard-context";
import { courseKeys } from "@/lib/query-keys";

type MutationContext = {
  previousCourses: CourseRow[];
};

const replaceCourseTodos = (
  courses: CourseRow[],
  courseId: string,
  courseTodos: CourseTodoItem[],
): CourseRow[] =>
  courses.map((course) =>
    course.id === courseId ? { ...course, courseTodos } : course,
  );

export const useUpdateCourseTodos = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CourseRow, Error, CourseTodoItem[], MutationContext>({
    mutationFn: (courseTodos) =>
      getQueries().then((queries) =>
        queries.updateCourseTodos(courseId, courseTodos),
      ),
    onMutate: async (courseTodos) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.all() });

      const previousCourses =
        queryClient.getQueryData<CourseRow[]>(courseKeys.all()) ?? [];
      queryClient.setQueryData<CourseRow[]>(courseKeys.all(), (courses = []) =>
        replaceCourseTodos(courses, courseId, courseTodos),
      );

      return { previousCourses };
    },
    onError: (_error, _todos, context) => {
      queryClient.setQueryData(courseKeys.all(), context?.previousCourses ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all() });
    },
  });
};
