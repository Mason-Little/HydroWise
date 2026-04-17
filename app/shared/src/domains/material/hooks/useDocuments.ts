import { getQueries } from "@hydrowise/data";
import { useQuery } from "@tanstack/react-query";
import { documentKeys } from "@/lib/query-keys";

export const useDocuments = () => {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: documentKeys.all(),
    queryFn: () => getQueries().then((q) => q.listDocuments()),
  });

  return { documents, isLoading };
};

export const useDocumentsByCourse = (courseId: string) => {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: documentKeys.byCourse(courseId),
    queryFn: () => getQueries().then((q) => q.listDocumentsByCourse(courseId)),
  });

  return { documents, isLoading };
};

export const useDocumentsByTopic = (topicId: string) => {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: documentKeys.byTopic(topicId),
    queryFn: () => getQueries().then((q) => q.listDocumentsByTopic(topicId)),
  });

  return { documents, isLoading };
};
