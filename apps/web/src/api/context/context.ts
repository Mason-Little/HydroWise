import type { Context, RetrieveContextRequest } from "@hydrowise/entities";
import { type APIResponse, client } from "@/api/client";

export const modelAPI = {
  getContextRetrieval: (payload: RetrieveContextRequest) => {
    return client
      .post("rag/retrieve-context", {
        json: payload,
      })
      .json<APIResponse<Context[]>>();
  },
};
