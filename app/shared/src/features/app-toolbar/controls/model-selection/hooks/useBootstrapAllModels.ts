import {
  type DownloadProgress,
  getEmbeddingModelManager,
  getLanguageModelManager,
  getVisionModelManager,
} from "@hydrowise/ai-runtime";
import { useState } from "react";
import { useModelStore } from "@/store/modelStore";

export type BootstrapDownloadStage = "language" | "embedding" | "vision";
export type BootstrapDownload = DownloadProgress & {
  stage: BootstrapDownloadStage;
};

type UseBootstrapAllModels = {
  bootstrapDownload: BootstrapDownload | null;
  isBootstrapping: boolean;
  bootstrapAllModels: () => Promise<void>;
};

const listCachedModelTiers = () => getLanguageModelManager().listCachedModels();

export const useBootstrapAllModels = (): UseBootstrapAllModels => {
  const [bootstrapDownload, setBootstrapDownload] =
    useState<BootstrapDownload | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const defaultModelTier = useModelStore((s) => s.defaultModelTier);
  const bootstrapMissingLanguage = useModelStore(
    (s) => s.bootstrapMissingLanguage,
  );
  const bootstrapMissingEmbedding = useModelStore(
    (s) => s.bootstrapMissingEmbedding,
  );
  const bootstrapMissingVision = useModelStore((s) => s.bootstrapMissingVision);

  const bootstrapAllModels = async () => {
    if (!defaultModelTier) return;

    setIsBootstrapping(true);

    const onProgress =
      (stage: BootstrapDownloadStage) => (p: DownloadProgress) =>
        setBootstrapDownload({ stage, ...p });

    try {
      // TODO: the banner flashes through all pending stages briefly before
      // settling on the first active one. Likely caused by the bootstrapMissing*
      // flags being read from the store snapshot at hook render time, so the
      // conditional rendering sees all three as true simultaneously on mount.
      // Need to drive stage visibility from local state rather than store flags.
      if (bootstrapMissingLanguage) {
        await getLanguageModelManager().downloadModel(defaultModelTier, {
          onProgress: onProgress("language"),
        });
        useModelStore.setState({
          bootstrapMissingLanguage: false,
          cachedModelTiers: await listCachedModelTiers(),
        });
        setBootstrapDownload(null);
      }

      if (bootstrapMissingEmbedding) {
        await getEmbeddingModelManager().downloadModel({
          onProgress: onProgress("embedding"),
        });
        useModelStore.setState({ bootstrapMissingEmbedding: false });
        setBootstrapDownload(null);
      }

      if (bootstrapMissingVision) {
        await getVisionModelManager().downloadModel({
          onProgress: onProgress("vision"),
        });
        useModelStore.setState({ bootstrapMissingVision: false });
        setBootstrapDownload(null);
      }

      useModelStore.setState({
        userBootstrapRequired: false,
        isWarmingModel: true,
      });

      try {
        await getLanguageModelManager().warmModel(defaultModelTier);
        await getEmbeddingModelManager().warmModel();
        useModelStore.setState({
          activeModelTier: defaultModelTier,
          isBootstrapped: true,
        });
      } finally {
        useModelStore.setState({ isWarmingModel: false });
      }
    } catch {
      setBootstrapDownload(null);
      throw new Error("Failed to bootstrap all models");
    } finally {
      setIsBootstrapping(false);
    }
  };

  return { bootstrapDownload, isBootstrapping, bootstrapAllModels };
};
