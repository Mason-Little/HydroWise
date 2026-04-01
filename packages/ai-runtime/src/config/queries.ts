import {
  DEFAULT_LANGUAGE_MODEL_TIER,
  EMBEDDING_MODEL,
  type EmbeddingModelDefinition,
  LANGUAGE_MODELS,
  type LanguageModelDefinition,
  type LanguageModelTier,
  VISION_MODEL,
  type VisionModelDefinition,
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

// Returns the default language model tier.
export const getDefaultLanguageModelTier = (): LanguageModelTier =>
  DEFAULT_LANGUAGE_MODEL_TIER;

// Returns the single embedding model definition.
export const getEmbeddingModelDefinition = (): EmbeddingModelDefinition =>
  EMBEDDING_MODEL;

// Returns the single vision model definition.
export const getVisionModelDefinition = (): VisionModelDefinition =>
  VISION_MODEL;
