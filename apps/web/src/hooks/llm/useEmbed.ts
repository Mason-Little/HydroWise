import { sendEmbeddings } from "@hydrowise/llm-client";
import { useLLMStore } from "@/store/llmStore";

export const useEmbed = (query: string) => {
  const { state } = useLLMStore();

  if (state === "cold") {
    return "model not loaded";
  }

  if (state === "warming") {
    return "model warming up";
  }

  return sendEmbeddings([query]);
};
