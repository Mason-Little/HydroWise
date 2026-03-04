import type { ChapterCreateInput } from "@hydrowise/entities";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chapterAPI } from "@/api/chapter/chapter";
import { queryClient } from "@/lib/query/query-client";

const getChaptersQueryKey = (courseId: string) =>
  ["chapters", courseId] as const;

export const useQueryChapters = (courseId?: string) => {
  const { data: chapters } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      if (!courseId) {
        return [];
      }

      return chapterAPI.getChaptersForCourse(courseId);
    },
    enabled: Boolean(courseId),
  });

  return {
    chapters: chapters ?? [],
  };
};

export const useMutationChapter = () => {
  const { mutateAsync: createChapter } = useMutation({
    mutationFn: (chapter: ChapterCreateInput) =>
      chapterAPI.createChapter(chapter),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getChaptersQueryKey(variables.courseId),
      });
    },
  });

  return {
    createChapter,
  };
};

export const useChapters = (courseId?: string) => {
  const { chapters } = useQueryChapters(courseId);
  const { createChapter } = useMutationChapter();

  return {
    createChapter,
    chapters,
  };
};
