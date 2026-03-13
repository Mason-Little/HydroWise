import {
  type AiRuntime,
  type DownloadProgress,
  getDefaultLanguageModelTier,
  getLanguageModelManager,
  getRuntime,
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
      onProgress: (progress) => set({ activeDownload: { tier: model, ...progress } }),
      onWarmed: () => {},
    });

    const cachedModelTiers = await listCachedModelTiers();

    set({ activeDownload: null, cachedModelTiers, selectedModelTier: model });
  },
  warmModel: async (model) => {
    const manager = getLanguageModelManager();

    set({ isWarmingModel: true, selectedModelTier: model });

    try {
      await manager.warmModel(model, { onWarmed: () => {} });
      set({ activeModelTier: model });
    } finally {
      set({ isWarmingModel: false });
    }
  },
}));

export const bootstrapModelStore = async (): Promise<void> => {
  const runtime = getRuntime();
  const defaultModelTier = getDefaultLanguageModelTier();
  const manager = getLanguageModelManager();
  const cachedModelTiers = await manager.listCachedModels();
  const isDefaultModelCached = cachedModelTiers.includes(defaultModelTier);

  useModelStore.setState({
    runtime,
    defaultModelTier,
    cachedModelTiers,
    selectedModelTier: defaultModelTier,
    activeModelTier: null,
    isBootstrapped: false,
    isWarmingModel: false,
  });

  if (!isDefaultModelCached) {
    useModelStore.setState({ isBootstrapped: true });
    return;
  }

  useModelStore.setState({ isWarmingModel: true });

  try {
    await manager.warmModel(defaultModelTier, { onWarmed: () => {} });

    useModelStore.setState({
      activeModelTier: defaultModelTier,
      isBootstrapped: true,
    });
  } finally {
    useModelStore.setState({ isWarmingModel: false });
  }
};
