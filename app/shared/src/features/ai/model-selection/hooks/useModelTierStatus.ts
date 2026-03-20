import {
  getLanguageModelDefinition,
  type LanguageModelTier,
} from "@hydrowise/ai-runtime";
import { useModelStore } from "@/store/modelStore";
import type { ModelActionVariant } from "../components/detail/ModelActionButton";

export type ModelTierStatus = {
  description: string;
  sizeLabel: string;
  sizeBytes: number;
  isCached: boolean;
  isActive: boolean;
  isSelected: boolean;
  isWarming: boolean;
  isDownloading: boolean;
  downloadBytesDownloaded: number;
  downloadBytesTotal: number;
  desktopOnly: boolean;
  actionVariant: ModelActionVariant;
  onAction: () => void;
};

const deriveActionVariant = (
  status: Omit<ModelTierStatus, "actionVariant" | "onAction">,
): ModelActionVariant => {
  if (status.desktopOnly) return "locked";
  if (status.isDownloading) return "warming";
  if (!status.isCached) return "download";
  if (status.isWarming) return "warming";
  if (status.isActive) return "active";
  return "warmup";
};

export const useModelTierStatus = (tier: LanguageModelTier): ModelTierStatus => {
  const runtime = useModelStore((s) => s.runtime);
  const activeModelTier = useModelStore((s) => s.activeModelTier);
  const selectedModelTier = useModelStore((s) => s.selectedModelTier);
  const cachedModelTiers = useModelStore((s) => s.cachedModelTiers);
  const isWarmingModel = useModelStore((s) => s.isWarmingModel);
  const activeDownload = useModelStore((s) => s.activeDownload);
  const downloadModel = useModelStore((s) => s.downloadModel);
  const warmModel = useModelStore((s) => s.warmModel);

  const definition = getLanguageModelDefinition(tier);
  const tierDownload = activeDownload?.tier === tier ? activeDownload : null;
  const isCached = cachedModelTiers.includes(tier);
  const isActive = activeModelTier === tier;
  const isSelected = selectedModelTier === tier;
  const isWarming = isWarmingModel && selectedModelTier === tier;
  const isDownloading = tierDownload !== null;
  const downloadBytesDownloaded = tierDownload?.bytesDownloaded ?? 0;
  const downloadBytesTotal = tierDownload?.bytesTotal ?? 0;
  const desktopOnly = runtime === "web" && !definition.web;

  const partial = {
    description: definition.description,
    sizeLabel: definition.sizeLabel,
    sizeBytes: definition.sizeBytes,
    isCached,
    isActive,
    isSelected,
    isWarming,
    isDownloading,
    downloadBytesDownloaded,
    downloadBytesTotal,
    desktopOnly,
  };

  const actionVariant = deriveActionVariant(partial);

  const onAction = () => {
    if (actionVariant === "download") downloadModel(tier);
    else if (actionVariant === "warmup") warmModel(tier);
  };

  return { ...partial, actionVariant, onAction };
};
