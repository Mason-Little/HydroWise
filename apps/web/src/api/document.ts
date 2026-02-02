import type { CreateDocumentResponse, DocumentMeta } from "@hydrowise/entities";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const USER_ID = "1";

const withUserHeaders = (headers: HeadersInit = {}) => ({
  ...headers,
  userId: USER_ID,
});

const jsonHeaders = withUserHeaders({ "Content-Type": "application/json" });

export const createDocument = async (
  payload: DocumentMeta,
): Promise<CreateDocumentResponse> => {
  const response = await fetch(`${BASE_URL}/document`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create document");
  }

  return response.json();
};
