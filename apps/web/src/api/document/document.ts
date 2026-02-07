import type { CreateDocumentRequest } from "@hydrowise/entities";
import { type APIResponse, client } from "@/api/client";

export const documentAPI = {
  uploadDocument: (document: CreateDocumentRequest) => {
    return client
      .post("document", {
        json: document,
      })
      .json<APIResponse<void>>();
  },
};
