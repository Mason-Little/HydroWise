import { getQueries } from "@hydrowise/data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const fetchDocumentPage = (documentId: string, pageNumber: number) =>
  getQueries().then((q) => q.getPage(documentId, pageNumber));

export const useDocumentPage = (
  documentId: string,
  pageNumber: number,
  totalPages: number,
) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["documentPage", documentId, pageNumber],
    queryFn: () => fetchDocumentPage(documentId, pageNumber),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!data) return;
    if (pageNumber >= totalPages) return;

    void queryClient.prefetchQuery({
      queryKey: ["documentPage", documentId, pageNumber + 1],
      queryFn: () => fetchDocumentPage(documentId, pageNumber + 1),
    });
  }, [data, documentId, pageNumber, totalPages, queryClient]);

  return { page: data, isLoading };
};
