import type {
  CreateTopicRequest,
  RetrieveTopicsRequest,
} from "@hydrowise/entities";
import { useMutation } from "@tanstack/react-query";
import { topicApi } from "@/api/topic/topic";

export const useTopicQueries = () => {
  const { mutateAsync: retrieveTopics } = useMutation({
    mutationFn: (request: RetrieveTopicsRequest) =>
      topicApi.retrieveTopics(request),
  });

  const { mutateAsync: createTopic } = useMutation({
    mutationFn: (request: CreateTopicRequest) => topicApi.createTopic(request),
  });

  return { retrieveTopics, createTopic };
};
