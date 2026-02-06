import { useMutation } from "@tanstack/react-query";
import { modelAPI } from "@/api/context/context";

export const useModel = () => {
  const {
    data: context,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["context-retrieval"],
    mutationFn: (embedding: number[]) =>
      modelAPI.getContextRetrieval(embedding),
  });

  return { context, isPending, error };
};
