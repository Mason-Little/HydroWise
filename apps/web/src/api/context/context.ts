import type {
  RetrieveContextRequest,
  RetrieveContextResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const modelAPI = {
  getContextRetrieval: (payload: RetrieveContextRequest) => {
    return client
      .post("rag/retrieve-context", {
        json: payload,
      })
      .json<RetrieveContextResponse>();
  },
};
