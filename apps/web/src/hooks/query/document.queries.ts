import type { CreateDocumentRequest } from "@hydrowise/entities";
import { useMutation } from "@tanstack/react-query";
import { documentAPI } from "@/api/document/document";

export const useDocument = () => {
  const { mutateAsync: uploadDocument } = useMutation({
    mutationKey: ["document-upload"],
    mutationFn: (document: CreateDocumentRequest) =>
      documentAPI.uploadDocument(document),
  });

  return { uploadDocument };
};
