import type {
  ContextQueryInput,
  EmbeddingCreateInput,
  GetContextResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const embeddingAPI = {
  getContextRetrieval: (payload: ContextQueryInput) => {
    return client
      .post("embedding/retrieve-context", {
        json: payload,
      })
      .json<GetContextResponse>();
  },

  createEmbeddingChunk: (payload: EmbeddingCreateInput) => {
    return client
      .post("embedding/create-embedding-chunk", {
        json: payload,
      })
      .json<null>();
  },
};
