import { getQueries } from "@hydrowise/data";
import type { ProfessorInformation } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "@/lib/query-keys";

export const useUpdateProfessorInformation = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<ProfessorInformation>) =>
      getQueries().then((q) => q.updateProfessorInformation(courseId, patch)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all() });
    },
  });
};
