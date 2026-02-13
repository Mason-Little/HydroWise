import type { TopicCreateInput, TopicQueryInput } from "@hydrowise/entities";
import { useMutation } from "@tanstack/react-query";
import { topicApi } from "@/api/topic/topic";

export const useTopicQueries = () => {
  const { mutateAsync: retrieveTopics } = useMutation({
    mutationFn: (request: TopicQueryInput) => topicApi.retrieveTopics(request),
  });

  const { mutateAsync: createTopic } = useMutation({
    mutationFn: (request: TopicCreateInput) => topicApi.createTopic(request),
  });

  const { mutateAsync: retrieveTopicEmbeddings } = useMutation({
    mutationFn: (topicId: string) => topicApi.retrieveTopicEmbeddings(topicId),
  });

  return { retrieveTopics, createTopic, retrieveTopicEmbeddings };
};
