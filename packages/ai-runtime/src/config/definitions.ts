export type LanguageModelTier = "Tiny" | "Fast" | "Balanced" | "High" | "Max";

export type LanguageModelId =
  | "qwen3.5-0.8b"
  | "qwen3.5-2b"
  | "qwen3.5-4b"
  | "qwen3.5-9b"
  | "qwen3.5-27b";

export type LanguageModelDefinition = {
  modelId: LanguageModelId;
  description: string;
  sizeLabel: string;
  sizeBytes: number;
  webModelId?: string;
  hfModelUrl?: string;
};

export const DEFAULT_WEB_LANGUAGE_MODEL_TIER: LanguageModelTier = "Balanced";
export const DEFAULT_DESKTOP_LANGUAGE_MODEL_TIER: LanguageModelTier = "High";

export const LANGUAGE_MODELS = {
  Tiny: {
    modelId: "qwen3.5-0.8b",
    description: "Fastest option for simple questions and quick study help.",
    sizeLabel: "0.5 GB",
    sizeBytes: 500_000_000,
    webModelId: "onnx-community/Qwen3.5-0.8B-ONNX",
    hfModelUrl:
      "https://huggingface.co/bartowski/Qwen_Qwen3.5-0.8B-GGUF/resolve/main/Qwen3.5-0.8B-Q4_K_M.gguf",
  },
  Fast: {
    modelId: "qwen3.5-2b",
    description: "Quick and reliable for everyday studying.",
    sizeLabel: "1.4 GB",
    sizeBytes: 1_400_000_000,
    webModelId: "onnx-community/Qwen3.5-2B-ONNX",
    hfModelUrl:
      "https://huggingface.co/bartowski/Qwen_Qwen3.5-2B-GGUF/resolve/main/Qwen3.5-2B-Q4_K_M.gguf",
  },
  Balanced: {
    modelId: "qwen3.5-4b",
    description: "Best mix of speed, clarity, and study quality.",
    sizeLabel: "2.5 GB",
    sizeBytes: 2_500_000_000,
    webModelId: "onnx-community/Qwen3.5-4B-ONNX",
    hfModelUrl:
      "https://huggingface.co/bartowski/Qwen_Qwen3.5-4B-GGUF/resolve/main/Qwen3.5-4B-Q4_K_M.gguf",
  },
  High: {
    modelId: "qwen3.5-9b",
    description:
      "Better for harder topics, deeper explanations, and tougher questions.",
    sizeLabel: "5.4 GB",
    sizeBytes: 5_400_000_000,
    hfModelUrl:
      "https://huggingface.co/bartowski/Qwen_Qwen3.5-9B-GGUF/resolve/main/Qwen3.5-9B-Q4_K_M.gguf",
  },
  Max: {
    modelId: "qwen3.5-27b",
    description: "Best quality for the most demanding study sessions.",
    sizeLabel: "16 GB",
    sizeBytes: 16_000_000_000,
    hfModelUrl:
      "https://huggingface.co/bartowski/Qwen_Qwen3.5-27B-GGUF/resolve/main/Qwen3.5-27B-Q4_K_M.gguf",
  },
} satisfies Record<LanguageModelTier, LanguageModelDefinition>;
