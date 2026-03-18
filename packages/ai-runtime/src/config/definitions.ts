// ─── Tier types ───────────────────────────────────────────────────────────────

export type LanguageModelTier = "Tiny" | "Fast" | "Balanced" | "High" | "Max";
export type EmbeddingModelTier = "embedding";
export type VisionModelTier = "vision";

// The slot identifier used for all model downloads and file-system paths.
// Each slot maps to models/{slot}/model.gguf on desktop.
export type ModelSlot =
  | LanguageModelTier
  | EmbeddingModelTier
  | VisionModelTier;

// ─── Model IDs ────────────────────────────────────────────────────────────────

export type LanguageModelId =
  | "qwen3.5-0.8b"
  | "qwen3.5-2b"
  | "qwen3.5-4b"
  | "qwen3.5-9b"
  | "qwen3.5-27b";

export type EmbeddingModelId = "bge-small-en-v1.5";
export type VisionModelId = "lighton-ocr-1b";

// ─── Definition types ─────────────────────────────────────────────────────────

// hfMmprojUrl is required on every definition:
//   null   → this model type never uses a multimodal projection file
//   string → the projection file must be downloaded alongside the model
type BaseModelDefinition = {
  description: string;
  sizeLabel: string;
  sizeBytes: number;
  hfMmprojUrl: string | null;
  webModelId?: string;
  hfModelUrl?: string;
};

export type LanguageModelDefinition = BaseModelDefinition & {
  modelId: LanguageModelId;
};

export type EmbeddingModelDefinition = BaseModelDefinition & {
  modelId: EmbeddingModelId;
};

export type VisionModelDefinition = BaseModelDefinition & {
  modelId: VisionModelId;
};

// ─── Default ──────────────────────────────────────────────────────────────────

export const DEFAULT_LANGUAGE_MODEL_TIER: LanguageModelTier = "Balanced";

// ─── Language models ──────────────────────────────────────────────────────────

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

// ─── Embedding model ──────────────────────────────────────────────────────────

export const EMBEDDING_MODEL = {
  modelId: "bge-small-en-v1.5",
  description: "Fast semantic embedding model for RAG search.",
  sizeLabel: "30 MB",
  sizeBytes: 30_000_000,
  webModelId: "onnx-community/bge-small-en-v1.5-ONNX",
  hfModelUrl:
    "https://huggingface.co/CompendiumLabs/bge-small-en-v1.5-gguf/resolve/main/bge-small-en-v1.5-q4_k_m.gguf",
  hfMmprojUrl: null,
} satisfies EmbeddingModelDefinition;

// ─── Vision model ─────────────────────────────────────────────────────────────

export const VISION_MODEL = {
  modelId: "lighton-ocr-1b",
  description:
    "Specialized OCR model for converting page images to markdown text.",
  sizeLabel: "0.8 GB",
  sizeBytes: 800_000_000,
  webModelId: "onnx-community/LightOnOCR-2-1B-ONNX",
  hfModelUrl:
    "https://huggingface.co/mradermacher/LightOnOCR-1B-1025-GGUF/resolve/main/LightOnOCR-1B-1025.Q4_K_M.gguf",
  hfMmprojUrl:
    "https://huggingface.co/mradermacher/LightOnOCR-1B-1025-GGUF/resolve/main/LightOnOCR-1B-1025.mmproj-Q8_0.gguf",
} satisfies VisionModelDefinition;
