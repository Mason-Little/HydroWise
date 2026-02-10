import type { CreateDocumentRequest } from "@hydrowise/entities";
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
    mutationFn: (document: CreateDocumentRequest) =>
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

  const { mutateAsync: getEmbeddingsChunks } = useMutation({
    mutationKey: ["embeddings-chunks"],
    mutationFn: (documentIds: string[]) =>
      documentAPI.getEmbeddingsChunks(documentIds),
  });

  return { documents, uploadDocument, deleteDocument, getEmbeddingsChunks };
};
