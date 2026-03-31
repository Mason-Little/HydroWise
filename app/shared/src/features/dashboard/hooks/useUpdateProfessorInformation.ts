import { getQueries } from "@hydrowise/data";
import type { ProfessorInformation } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfessorInformation = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<ProfessorInformation>) =>
      getQueries().then((q) => q.updateProfessorInformation(courseId, patch)),
    onSuccess: () => {
      // TODO: Briefly shows stale UI after save until refetch completes (flicker).
      // Fix later with optimistic cache updates or local pending state in EditableField.
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
