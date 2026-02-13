import type { DocumentCreateInput } from "@hydrowise/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentAPI } from "@/api/document/document";

export const useDocument = () => {
  const queryClient = useQueryClient();
  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentAPI.getDocuments(),
  });

  const { mutateAsync: uploadDocument } = useMutation({
    mutationKey: ["document-upload"],
    mutationFn: (document: DocumentCreateInput) =>
      documentAPI.uploadDocument(document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const { mutateAsync: deleteDocument } = useMutation({
    mutationFn: (documentId: string) => documentAPI.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const { mutateAsync: updateDocumentStatus } = useMutation({
    mutationFn: ({
      documentId,
      status,
    }: {
      documentId: string;
      status: "pending" | "completed" | "failed";
    }) => documentAPI.updateDocumentStatus(documentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return { documents, uploadDocument, deleteDocument, updateDocumentStatus };
};
