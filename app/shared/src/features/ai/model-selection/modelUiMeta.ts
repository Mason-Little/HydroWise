import type { LanguageModelId } from "@hydrowise/ai-runtime";

type ModelUiMeta = {
  sizeBytes: number;
  sizeLabel: string;
};

export const MODEL_UI_META: Record<LanguageModelId, ModelUiMeta> = {
  "qwen3.5-0.8b": {
    sizeBytes: 500_000_000,
    sizeLabel: "0.5 GB",
  },
  "qwen3.5-2b": {
    sizeBytes: 1_400_000_000,
    sizeLabel: "1.4 GB",
  },
  "qwen3.5-4b": {
    sizeBytes: 2_500_000_000,
    sizeLabel: "2.5 GB",
  },
  "qwen3.5-9b": {
    sizeBytes: 5_400_000_000,
    sizeLabel: "5.4 GB",
  },
  "qwen3.5-27b": {
    sizeBytes: 16_000_000_000,
    sizeLabel: "16 GB",
  },
};
