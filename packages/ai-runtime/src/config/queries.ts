import {
  DEFAULT_DESKTOP_LANGUAGE_MODEL_TIER,
  DEFAULT_WEB_LANGUAGE_MODEL_TIER,
  LANGUAGE_MODELS,
  type LanguageModelDefinition,
  type LanguageModelTier,
} from "./definitions";

export const getLanguageModelDefinition = (
  tier: LanguageModelTier,
): LanguageModelDefinition => LANGUAGE_MODELS[tier];

export const getLanguageModels = (): Record<
  LanguageModelTier,
  LanguageModelDefinition
> => LANGUAGE_MODELS;

export const getDefaultLanguageModelTier = (
  runtime: "web" | "desktop",
): LanguageModelTier => {
  switch (runtime) {
    case "web":
      return DEFAULT_WEB_LANGUAGE_MODEL_TIER;
    case "desktop":
      return DEFAULT_DESKTOP_LANGUAGE_MODEL_TIER;
  }
};
