import { runtimeState } from "@/runtime";
import {
  DEFAULT_DESKTOP_LANGUAGE_MODEL_TIER,
  DEFAULT_WEB_LANGUAGE_MODEL_TIER,
  LANGUAGE_MODELS,
  type LanguageModelDefinition,
  type LanguageModelTier,
} from "@/config/definitions";

// Returns the definition for the given tier.
export const getLanguageModelDefinition = (
  tier: LanguageModelTier,
): LanguageModelDefinition => LANGUAGE_MODELS[tier];

// Returns the full tier → definition map.
export const getLanguageModels = (): Record<
  LanguageModelTier,
  LanguageModelDefinition
> => LANGUAGE_MODELS;

// Returns the default tier for the given runtime.
export const getDefaultLanguageModelTier = (): LanguageModelTier => {
  switch (runtimeState.currentRuntime) {
    case "web":
      return DEFAULT_WEB_LANGUAGE_MODEL_TIER;
    case "desktop":
      return DEFAULT_DESKTOP_LANGUAGE_MODEL_TIER;
  }
};
