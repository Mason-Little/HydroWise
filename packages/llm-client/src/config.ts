export const LLM_CONFIG = {
  model: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
  temperature: 0.6,
  maxTokens: 128,
} as const;

export const EMBEDDING_CONFIG = {
  model: "Xenova/bge-base-en-v1.5",
  normalize: true,
  pooling: "mean",
} as const;
