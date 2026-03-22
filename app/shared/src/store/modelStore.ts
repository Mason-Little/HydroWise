import {
  type AiRuntime,
  type DownloadProgress,
  getDefaultLanguageModelTier,
  getEmbeddingModelManager,
  getLanguageModelManager,
  getRuntime,
  getVisionModelManager,
  type LanguageModelTier,
} from "@hydrowise/ai-runtime";
import { create } from "zustand";

const listCachedModelTiers = async (): Promise<LanguageModelTier[]> => {
  const manager = getLanguageModelManager();

  return manager.listCachedModels();
};

type ActiveDownload = DownloadProgress & { tier: LanguageModelTier };

interface ModelStore {
  runtime: AiRuntime | null;
  defaultModelTier: LanguageModelTier | null;
  activeModelTier: LanguageModelTier | null;
  selectedModelTier: LanguageModelTier | null;
  cachedModelTiers: LanguageModelTier[];
  activeDownload: ActiveDownload | null;
  isBootstrapped: boolean;
  userBootstrapRequired: boolean;
  bootstrapMissingLanguage: boolean;
  bootstrapMissingEmbedding: boolean;
  bootstrapMissingVision: boolean;
  isWarmingModel: boolean;
  setActiveModelTier: (model: LanguageModelTier | null) => void;
  setSelectedModelTier: (model: LanguageModelTier | null) => void;
  refreshCachedModelTiers: () => Promise<LanguageModelTier[]>;
  downloadModel: (model: LanguageModelTier) => Promise<void>;
  warmModel: (model: LanguageModelTier) => Promise<void>;
  warmVisionModel: () => Promise<void>;
  coolVisionModel: () => Promise<void>;
}

export const useModelStore = create<ModelStore>((set) => ({
  runtime: null,
  defaultModelTier: null,
  activeModelTier: null,
  selectedModelTier: null,
  cachedModelTiers: [],
  activeDownload: null,
  isBootstrapped: false,
  userBootstrapRequired: false,
  bootstrapMissingLanguage: false,
  bootstrapMissingEmbedding: false,
  bootstrapMissingVision: false,
  isWarmingModel: false,
  setActiveModelTier: (model) => set({ activeModelTier: model }),
  setSelectedModelTier: (model) => set({ selectedModelTier: model }),
  refreshCachedModelTiers: async () => {
    const cachedModelTiers = await listCachedModelTiers();

    set({ cachedModelTiers });

    return cachedModelTiers;
  },
  downloadModel: async (model) => {
    const manager = getLanguageModelManager();

    // TODO: mmproj file (~300 MB–1 GB) is downloaded separately after the main
    // model file but is not tracked here. The download appears "complete" before
    // the mmproj finishes, so the progress bar disappears early and warmup
    // takes unexpectedly long. Need to expose mmproj download progress from
    // ai-runtime and include it in activeDownload (or as a second phase).
    await manager.downloadModel(model, {
      onProgress: (progress) =>
        set({ activeDownload: { tier: model, ...progress } }),
    });

    const cachedModelTiers = await listCachedModelTiers();

    set({ activeDownload: null, cachedModelTiers, selectedModelTier: model });
  },
  warmModel: async (model) => {
    const manager = getLanguageModelManager();

    set({ isWarmingModel: true, selectedModelTier: model });

    try {
      await manager.warmModel(model);
      set({ activeModelTier: model });
    } finally {
      set({ isWarmingModel: false });
    }
  },
  warmVisionModel: async () => {
    const manager = getVisionModelManager();
    await manager.warmModel();
  },
  coolVisionModel: async () => {
    const manager = getVisionModelManager();
    await manager.coolModel();
  },
}));

export const bootstrapModelStore = async (): Promise<void> => {
  const runtime = getRuntime();

  const defaultModelTier = getDefaultLanguageModelTier();
  const languageManager = getLanguageModelManager();
  const embeddingManager = getEmbeddingModelManager();
  const visionManager = getVisionModelManager();

  const [
    cachedModelTiers,
    isLanguageCached,
    isEmbeddingCached,
    isVisionCached,
  ] = await Promise.all([
    languageManager.listCachedModels(),
    languageManager.isDefaultModelCached(),
    embeddingManager.isModelCached(),
    visionManager.isModelCached(),
  ]);

  const bootstrapMissingLanguage = !isLanguageCached;
  const bootstrapMissingEmbedding = !isEmbeddingCached;
  const bootstrapMissingVision = !isVisionCached;
  const userBootstrapRequired =
    bootstrapMissingLanguage ||
    bootstrapMissingEmbedding ||
    bootstrapMissingVision;

  useModelStore.setState({
    runtime,
    defaultModelTier,
    cachedModelTiers,
    selectedModelTier: defaultModelTier,
    activeModelTier: null,
    isBootstrapped: userBootstrapRequired,
    userBootstrapRequired,
    bootstrapMissingLanguage,
    bootstrapMissingEmbedding,
    bootstrapMissingVision,
    isWarmingModel: false,
  });

  if (userBootstrapRequired) return;

  useModelStore.setState({ isWarmingModel: true });

  try {
    await languageManager.warmModel(defaultModelTier);
    await embeddingManager.warmModel();

    useModelStore.setState({
      activeModelTier: defaultModelTier,
      isBootstrapped: true,
    });
  } finally {
    useModelStore.setState({ isWarmingModel: false });
  }
};
