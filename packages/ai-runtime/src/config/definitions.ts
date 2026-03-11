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
  webModelId?: string;
  hfRepo?: string;
};

export const DEFAULT_WEB_LANGUAGE_MODEL_TIER: LanguageModelTier = "Balanced";
export const DEFAULT_DESKTOP_LANGUAGE_MODEL_TIER: LanguageModelTier = "High";

export const LANGUAGE_MODELS = {
  Tiny: {
    modelId: "qwen3.5-0.8b",
    description: "Fastest option for simple questions and quick study help.",
    webModelId: "onnx-community/Qwen3.5-0.8B-ONNX",
    hfRepo: "bartowski/Qwen_Qwen3.5-0.8B-GGUF",
  },
  Fast: {
    modelId: "qwen3.5-2b",
    description: "Quick and reliable for everyday studying.",
    webModelId: "onnx-community/Qwen3.5-2B-ONNX",
    hfRepo: "bartowski/Qwen_Qwen3.5-2B-GGUF",
  },
  Balanced: {
    modelId: "qwen3.5-4b",
    description: "Best mix of speed, clarity, and study quality.",
    webModelId: "onnx-community/Qwen3.5-4B-ONNX",
    hfRepo: "bartowski/Qwen_Qwen3.5-4B-GGUF",
  },
  High: {
    modelId: "qwen3.5-9b",
    description:
      "Better for harder topics, deeper explanations, and tougher questions.",
    hfRepo: "bartowski/Qwen_Qwen3.5-9B-GGUF",
  },
  Max: {
    modelId: "qwen3.5-27b",
    description: "Best quality for the most demanding study sessions.",
    hfRepo: "bartowski/Qwen_Qwen3.5-27B-GGUF",
  },
} satisfies Record<LanguageModelTier, LanguageModelDefinition>;
