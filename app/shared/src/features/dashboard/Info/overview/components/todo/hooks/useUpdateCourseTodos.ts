import { getQueries } from "@hydrowise/data";
import type { CourseTodoItem } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseRow } from "@/features/dashboard/Dashboard";

type CourseTodosMutationContext = {
  previousCourses: CourseRow[];
};

const coursesQueryKey = ["courses"] as const;

const withCourseTodos = (
  courses: CourseRow[],
  courseId: string,
  courseTodos: CourseTodoItem[],
): CourseRow[] =>
  courses.map((course) =>
    course.id === courseId ? { ...course, courseTodos } : course,
  );

export const useUpdateCourseTodos = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    CourseRow,
    Error,
    CourseTodoItem[],
    CourseTodosMutationContext
  >({
    mutationFn: (courseTodos) =>
      getQueries().then((queries) =>
        queries.updateCourseTodos(courseId, courseTodos),
      ),
    onMutate: async (courseTodos) => {
      await queryClient.cancelQueries({ queryKey: coursesQueryKey });

      const previousCourses =
        queryClient.getQueryData<CourseRow[]>(coursesQueryKey) ?? [];
      queryClient.setQueryData<CourseRow[]>(coursesQueryKey, (courses = []) =>
        withCourseTodos(courses, courseId, courseTodos),
      );

      return { previousCourses };
    },
    onError: (_error, _courseTodos, context) => {
      queryClient.setQueryData(coursesQueryKey, context?.previousCourses ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: coursesQueryKey });
    },
  });
};
