import { sendEmbeddings } from "@hydrowise/llm-client";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const getRagApi = async (userEmbedding: string) => {
  const embeddings = await sendEmbeddings([userEmbedding]);

  const response = await fetch(`${BASE_URL}/rag/retrieve-context`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userId: "1",
    },
    body: JSON.stringify({ embedding: embeddings[0] }),
  });
  if (!response.ok) {
    throw new Error("Failed to retrieve RAG context");
  }

  const data: { data: { content: string }[] } = await response.json();
  return data.data.map((item) => item.content).join("\n");
};
