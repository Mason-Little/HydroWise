import type {
  CreateDocumentRequest,
  CreatedDocument,
} from "@hydrowise/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentAPI } from "@/api/document/document";
import { makeOptimisticListMutation } from "@/lib/query/query-optimistic";

export const useDocument = () => {
  const queryClient = useQueryClient();
  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentAPI.getDocuments(),
  });

  const { mutateAsync: uploadDocument } = useMutation({
    mutationKey: ["document-upload"],
    mutationFn: (document: CreateDocumentRequest) =>
      documentAPI.uploadDocument(document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const { mutateAsync: deleteDocument } = useMutation({
    mutationFn: (documentId: string) => documentAPI.deleteDocument(documentId),
    ...makeOptimisticListMutation<CreatedDocument, string>({
      queryKey: ["documents"],
      apply: (current, documentId) =>
        current.filter((document) => document.id !== documentId),
    }),
  });

  return { documents: documents?.data, uploadDocument, deleteDocument };
};
