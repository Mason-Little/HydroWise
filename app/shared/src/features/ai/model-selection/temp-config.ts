export type LanguageModelId =
  | "qwen3.5-0.8b"
  | "qwen3.5-2b"
  | "qwen3.5-4b"
  | "qwen3.5-9b"
  | "qwen3.5-27b";

export type LanguageModelDownloadState =
  | "not-downloaded"
  | "downloading"
  | "downloaded";

export type LanguageModelLoadState =
  | "unavailable"
  | "idle"
  | "ready"
  | "in-use";

export type TempLanguageModelDefinition = {
  id: LanguageModelId;
  label: string;
  description: string;
  web: {
    enabled: boolean;
    // Replace these temporary web flags with backend-provided status/actions later.
    placeholderStatus?: "temp";
  };
  sizeLabel: string;
  sizeBytes: number;
};

export const MODEL_OPTIONS = [
  {
    id: "qwen3.5-0.8b",
    label: "Tiny",
    description: "Fastest option for simple questions and quick study help.",
    web: { enabled: true, placeholderStatus: "temp" },
    sizeLabel: "0.5 GB",
    sizeBytes: 500_000_000,
  },
  {
    id: "qwen3.5-2b",
    label: "Fast",
    description: "Quick and reliable for everyday studying.",
    web: { enabled: true, placeholderStatus: "temp" },
    sizeLabel: "1.4 GB",
    sizeBytes: 1_400_000_000,
  },
  {
    id: "qwen3.5-4b",
    label: "Balanced",
    description: "Best mix of speed, clarity, and study quality.",
    web: { enabled: true, placeholderStatus: "temp" },
    sizeLabel: "2.5 GB",
    sizeBytes: 2_500_000_000,
  },
  {
    id: "qwen3.5-9b",
    label: "High",
    description:
      "Better for harder topics, deeper explanations, and tougher questions.",
    web: { enabled: false, placeholderStatus: "temp" },
    sizeLabel: "5.4 GB",
    sizeBytes: 5_400_000_000,
  },
  {
    id: "qwen3.5-27b",
    label: "Max",
    description: "Best quality for the most demanding study sessions.",
    web: { enabled: false, placeholderStatus: "temp" },
    sizeLabel: "16 GB",
    sizeBytes: 16_000_000_000,
  },
] as const satisfies readonly TempLanguageModelDefinition[];

export const DEFAULT_MODEL_ID: LanguageModelId = "qwen3.5-4b";

const modelDefinitionById = Object.fromEntries(
  MODEL_OPTIONS.map((model) => [model.id, model]),
) as Record<LanguageModelId, TempLanguageModelDefinition>;

export const getModelDefinition = (
  id: LanguageModelId,
): TempLanguageModelDefinition => modelDefinitionById[id];
