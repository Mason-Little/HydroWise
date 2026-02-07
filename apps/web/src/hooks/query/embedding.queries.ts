import { useMutation } from "@tanstack/react-query";
import { modelAPI } from "@/api/context/context";

export const useDocument = () => {
  const {
    mutateAsync: contextRetrieval,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["context-retrieval"],
    mutationFn: (embedding: number[]) =>
      modelAPI.getContextRetrieval({ embedding }),
  });
  return { contextRetrieval, isPending, error };
};
