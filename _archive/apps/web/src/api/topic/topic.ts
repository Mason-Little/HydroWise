import type {
  Embedding,
  GetTopicsResponse,
  Topic,
  TopicCreateInput,
  TopicQueryInput,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const topicApi = {
  retrieveTopics: (payload: TopicQueryInput) => {
    return client
      .post("topic/retrieve-topics", {
        json: payload,
      })
      .json<GetTopicsResponse>();
  },

  createTopic: (payload: TopicCreateInput) => {
    return client
      .post("topic/create-topic", {
        json: payload,
      })
      .json<Topic>();
  },

  retrieveTopicEmbeddings: (topicId: string) => {
    return client.get(`topic/${topicId}/embeddings`).json<Embedding[]>();
  },
};
