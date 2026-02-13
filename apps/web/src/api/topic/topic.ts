import type {
  CreateTopicRequest,
  Embedding,
  RetrieveTopicsRequest,
  RetrieveTopicsResponse,
  Topic,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const topicApi = {
  retrieveTopics: (payload: RetrieveTopicsRequest) => {
    return client
      .post("topic/retrieve-topics", {
        json: payload,
      })
      .json<RetrieveTopicsResponse>();
  },

  createTopic: (payload: CreateTopicRequest) => {
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
