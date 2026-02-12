import type {
  CreateDocumentRequest,
  CreateDocumentResponse,
  GetDocumentsResponse,
  NoContentResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const documentAPI = {
  getDocuments: () => {
    return client.get("document").json<GetDocumentsResponse>();
  },

  uploadDocument: (document: CreateDocumentRequest) => {
    return client
      .post("document", {
        json: document,
      })
      .json<CreateDocumentResponse>();
  },

  deleteDocument: (id: string) => {
    return client
      .delete(`document/${id}`)
      .then((): NoContentResponse => undefined);
  },

  updateDocumentStatus: (
    id: string,
    status: "pending" | "completed" | "failed",
  ) => {
    return client
      .put(`document/status/${id}/${status}`)
      .then((): NoContentResponse => undefined);
  },
};
