import { DESKTOP_EMBEDDING_SERVER_ORIGIN } from "@/backends/desktop/constants";

// Builds the full URL for a path on the desktop embeddings server.
const createDesktopEmbeddingUrl = (path: string): string => {
  return new URL(path, `${DESKTOP_EMBEDDING_SERVER_ORIGIN}/`).toString();
};

type DesktopEmbeddingRequest = {
  path: string;
  init?: RequestInit;
};

// Turns a failed response into a short status + body string.
const toErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.text();
  return body ? `${response.status} ${body}` : `${response.status}`;
};

// Fetches a path on the desktop embeddings server and throws if not ok.
export const requestDesktopEmbedding = async (
  request: DesktopEmbeddingRequest,
): Promise<Response> => {
  const response = await fetch(createDesktopEmbeddingUrl(request.path), {
    ...request.init,
    headers: {
      "content-type": "application/json",
      ...request.init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Desktop embeddings server request failed: ${await toErrorMessage(response)}`,
    );
  }

  return response;
};

// Fetches JSON from the desktop embeddings server and returns parsed T.
export const requestDesktopEmbeddingJson = async <T>(
  request: DesktopEmbeddingRequest,
): Promise<T> => {
  const response = await requestDesktopEmbedding(request);
  return (await response.json()) as T;
};

// Fetches a path on the desktop embeddings server and discards the response.
export const requestDesktopEmbeddingVoid = async (
  request: DesktopEmbeddingRequest,
): Promise<void> => {
  await requestDesktopEmbedding(request);
};
