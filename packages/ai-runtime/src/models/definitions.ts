export type LanguageModelTier = "tiny" | "fast" | "balanced" | "high" | "max";

export type LanguageModelId =
  | "qwen3.5-0.8b"
  | "qwen3.5-2b"
  | "qwen3.5-4b"
  | "qwen3.5-9b"
  | "qwen3.5-27b";

export type LanguageModelDefinition = {
  id: LanguageModelId;
  tier: LanguageModelTier;
  label: string;
  description: string;
  webModelId?: string;
  hfRepo?: string;
};

export const DEFAULT_WEB_LANGUAGE_MODEL_ID: LanguageModelId = "qwen3.5-4b";
export const DEFAULT_DESKTOP_LANGUAGE_MODEL_ID: LanguageModelId = "qwen3.5-9b";

export const LANGUAGE_MODELS = [
  {
    id: "qwen3.5-0.8b",
    tier: "tiny",
    label: "Tiny",
    description: "Fastest option for simple questions and quick study help.",
    webModelId: "onnx-community/Qwen3.5-0.8B-ONNX",
    hfRepo: "bartowski/Qwen_Qwen3.5-0.8B-GGUF",
  },
  {
    id: "qwen3.5-2b",
    tier: "fast",
    label: "Fast",
    description: "Quick and reliable for everyday studying.",
    webModelId: "onnx-community/Qwen3.5-2B-ONNX",
    hfRepo: "bartowski/Qwen_Qwen3.5-2B-GGUF",
  },
  {
    id: "qwen3.5-4b",
    tier: "balanced",
    label: "Balanced",
    description: "Best mix of speed, clarity, and study quality.",
    webModelId: "onnx-community/Qwen3.5-4B-ONNX",
    hfRepo: "bartowski/Qwen_Qwen3.5-4B-GGUF",
  },
  {
    id: "qwen3.5-9b",
    tier: "high",
    label: "High",
    description:
      "Better for harder topics, deeper explanations, and tougher questions.",
    hfRepo: "bartowski/Qwen_Qwen3.5-9B-GGUF",
  },
  {
    id: "qwen3.5-27b",
    tier: "max",
    label: "Max",
    description: "Best quality for the most demanding study sessions.",
    hfRepo: "bartowski/Qwen_Qwen3.5-27B-GGUF",
  },
] as const satisfies readonly LanguageModelDefinition[];
