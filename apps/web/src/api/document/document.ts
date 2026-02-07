import type {
  CreateDocumentRequest,
  CreateDocumentResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const documentAPI = {
  uploadDocument: (document: CreateDocumentRequest) => {
    return client
      .post("document", {
        json: document,
      })
      .json<CreateDocumentResponse>();
  },
};
