import { parseDocumentMeta } from "@hydrowise/core";
import type { CreateDocumentResponse } from "@hydrowise/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "@/api/document";

export interface UseDocumentOptions {
  /** Callback when upload succeeds */
  onSuccess?: (response: CreateDocumentResponse) => void;
  /** Callback when upload fails */
  onError?: (error: Error) => void;
}

export const useDocument = (options: UseDocumentOptions = {}) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: uploadDocument,
    error,
    isPending,
    isSuccess,
    isError,
    reset,
  } = useMutation({
    mutationFn: async (file: File) => {
      const meta = await parseDocumentMeta(file);
      return createDocument(meta);
    },
    onSuccess: (response) => {
      // Invalidate any document-related queries
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      options.onSuccess?.(response);
    },
    onError: (err) => {
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
    },
  });

  return {
    uploadDocument,
    error,
    isPending,
    isSuccess,
    isError,
    reset,
  };
};
