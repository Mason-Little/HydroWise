export type LanguageModelTier = "Tiny" | "Fast" | "Balanced" | "High" | "Max";

export type VisionModelId = "lighton-ocr-1b";

export type VisionModelDefinition = {
  modelId: VisionModelId;
  description: string;
  sizeLabel: string;
  sizeBytes: number;
  webModelId?: string;
  hfModelUrl?: string;
  hfMmprojUrl?: string;
};

export const VISION_MODELS = {
  OCR: {
    modelId: "lighton-ocr-1b",
    description: "Specialized OCR model for extracting text from images and documents.",
    sizeLabel: "0.8 GB",
    sizeBytes: 800_000_000,
    webModelId: "onnx-community/LightOnOCR-2-1B-ONNX",
    hfModelUrl:
      "https://huggingface.co/mradermacher/LightOnOCR-1B-1025-GGUF/resolve/main/LightOnOCR-1B-1025.Q4_K_M.gguf",
    hfMmprojUrl:
      "https://huggingface.co/mradermacher/LightOnOCR-1B-1025-GGUF/resolve/main/LightOnOCR-1B-1025.mmproj-Q8_0.gguf",
  },
} satisfies Record<string, VisionModelDefinition>;

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
  hfMmprojUrl?: string;
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
      "https://huggingface.co/unsloth/Qwen3.5-0.8B-GGUF/resolve/main/Qwen3.5-0.8B-Q4_K_M.gguf?download=true",
    hfMmprojUrl:
      "https://huggingface.co/unsloth/Qwen3.5-0.8B-GGUF/resolve/main/mmproj-F16.gguf?download=true",
  },
  Fast: {
    modelId: "qwen3.5-2b",
    description: "Quick and reliable for everyday studying.",
    sizeLabel: "1.4 GB",
    sizeBytes: 1_400_000_000,
    webModelId: "onnx-community/Qwen3.5-2B-ONNX",
    hfModelUrl:
      "https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/main/Qwen3.5-2B-Q4_K_M.gguf?download=true",
    hfMmprojUrl:
      "https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/main/mmproj-F16.gguf?download=true",
  },
  Balanced: {
    modelId: "qwen3.5-4b",
    description: "Best mix of speed, clarity, and study quality.",
    sizeLabel: "2.5 GB",
    sizeBytes: 2_500_000_000,
    webModelId: "onnx-community/Qwen3.5-4B-ONNX",
    hfModelUrl:
      "https://huggingface.co/unsloth/Qwen3.5-4B-GGUF/resolve/main/Qwen3.5-4B-Q4_K_M.gguf?download=true",
    hfMmprojUrl:
      "https://huggingface.co/unsloth/Qwen3.5-4B-GGUF/resolve/main/mmproj-F16.gguf?download=true",
  },
  High: {
    modelId: "qwen3.5-9b",
    description:
      "Better for harder topics, deeper explanations, and tougher questions.",
    sizeLabel: "5.4 GB",
    sizeBytes: 5_400_000_000,
    hfModelUrl:
      "https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/resolve/main/Qwen3.5-9B-Q4_K_M.gguf?download=true",
    hfMmprojUrl:
      "https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/resolve/main/mmproj-F16.gguf?download=true",
  },
  Max: {
    modelId: "qwen3.5-27b",
    description: "Best quality for the most demanding study sessions.",
    sizeLabel: "16 GB",
    sizeBytes: 16_000_000_000,
    hfModelUrl:
      "https://huggingface.co/unsloth/Qwen3.5-27B-GGUF/resolve/main/Qwen3.5-27B-Q4_K_M.gguf?download=true",
    hfMmprojUrl:
      "https://huggingface.co/unsloth/Qwen3.5-27B-GGUF/resolve/main/mmproj-F16.gguf?download=true",
  },
} satisfies Record<LanguageModelTier, LanguageModelDefinition>;
