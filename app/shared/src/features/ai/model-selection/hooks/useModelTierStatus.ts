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
  downloadProgressPercent: number;
  desktopOnly: boolean;
  actionVariant: ModelActionVariant;
  onAction: () => void;
};

const deriveActionVariant = (
  status: Omit<ModelTierStatus, "actionVariant" | "onAction">,
): ModelActionVariant => {
  if (status.desktopOnly) return "locked";
  if (status.isDownloading) return "progress";
  if (!status.isCached) return "download";
  if (status.isWarming) return "warming";
  if (status.isActive) return "active";
  return "warmup";
};

export const useModelTierStatus = (tier: LanguageModelTier): ModelTierStatus => {
  const {
    runtime,
    activeModelTier,
    selectedModelTier,
    cachedModelTiers,
    isWarmingModel,
    activeDownload,
    downloadModel,
    warmModel,
  } = useModelStore();

  const definition = getLanguageModelDefinition(tier);
  const tierDownload = activeDownload?.tier === tier ? activeDownload : null;
  const isCached = cachedModelTiers.includes(tier);
  const isActive = activeModelTier === tier;
  const isSelected = selectedModelTier === tier;
  const isWarming = isWarmingModel && selectedModelTier === tier;
  const isDownloading = tierDownload !== null;
  const downloadProgressPercent = tierDownload ? Math.round(tierDownload.progress * 100) : 0;
  const desktopOnly = runtime === "web" && !definition.webModelId;

  const partial = {
    description: definition.description,
    sizeLabel: definition.sizeLabel,
    sizeBytes: definition.sizeBytes,
    isCached,
    isActive,
    isSelected,
    isWarming,
    isDownloading,
    downloadProgressPercent,
    desktopOnly,
  };

  const actionVariant = deriveActionVariant(partial);

  const onAction = () => {
    if (actionVariant === "download") downloadModel(tier);
    else if (actionVariant === "warmup") warmModel(tier);
  };

  return { ...partial, actionVariant, onAction };
};
