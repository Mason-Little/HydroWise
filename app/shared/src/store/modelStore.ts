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
}));

export const bootstrapModelStore = async (): Promise<void> => {
  const runtime = getRuntime();

  const defaultModelTier = getDefaultLanguageModelTier();
  const languageManager = getLanguageModelManager();
  const embeddingManager = getEmbeddingModelManager();
  const visionManager = getVisionModelManager();

  const cachedModelTiers = await languageManager.listCachedModels();
  const [isEmbeddingCached, isVisionCached] = await Promise.all([
    embeddingManager.isModelCached(),
    visionManager.isModelCached(),
  ]);

  const bootstrapMissingLanguage = !cachedModelTiers.includes(defaultModelTier);
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
    isBootstrapped: false,
    userBootstrapRequired,
    bootstrapMissingLanguage,
    bootstrapMissingEmbedding,
    bootstrapMissingVision,
    isWarmingModel: false,
  });

  if (userBootstrapRequired) {
    useModelStore.setState({ isBootstrapped: true });
    return;
  }

  useModelStore.setState({ isWarmingModel: true });

  try {
    await languageManager.warmModel(defaultModelTier);
    await embeddingManager.warmModel();

    useModelStore.setState({
      activeModelTier: defaultModelTier,
      isBootstrapped: true,
      userBootstrapRequired: false,
      bootstrapMissingLanguage: false,
      bootstrapMissingEmbedding: false,
      bootstrapMissingVision: false,
    });
  } finally {
    useModelStore.setState({ isWarmingModel: false });
  }
};
