import type {
  CreateEmbeddingRequest,
  RetrieveContextRequest,
  RetrieveContextResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const embeddingAPI = {
  getContextRetrieval: (payload: RetrieveContextRequest) => {
    return client
      .post("embedding/retrieve-context", {
        json: payload,
      })
      .json<RetrieveContextResponse>();
  },

  createEmbeddingChunk: (payload: CreateEmbeddingRequest) => {
    return client
      .post("embedding/create-embedding-chunk", {
        json: payload,
      })
      .json<null>();
  },
};
