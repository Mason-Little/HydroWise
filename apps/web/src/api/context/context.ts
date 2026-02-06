import { type APIResponse, client } from "@/api/client";

export const modelAPI = {
  getContextRetrieval: (embedding: number[]) => {
    return client
      .post("rag/retrieve-context", {
        json: { embedding },
      })
      .json<
        APIResponse<
          {
            content: string;
            similarity: number;
          }[]
        >
      >();
  },
};
