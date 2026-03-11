import {
  DEFAULT_DESKTOP_LANGUAGE_MODEL_ID,
  DEFAULT_WEB_LANGUAGE_MODEL_ID,
  LANGUAGE_MODELS,
  type LanguageModelDefinition,
  type LanguageModelId,
} from "./language-models";

export const LANGUAGE_MODEL_BY_ID = Object.fromEntries(
  LANGUAGE_MODELS.map((model) => [model.id, model]),
) as Record<LanguageModelId, LanguageModelDefinition>;

export function getLanguageModelDefinition(id: LanguageModelId) {
  return LANGUAGE_MODEL_BY_ID[id];
}

export function getLanguageModels() {
  return LANGUAGE_MODELS;
}

export function getDefaultLanguageModelId(
  platform: "web" | "desktop",
): LanguageModelId {
  switch (platform) {
    case "web":
      return DEFAULT_WEB_LANGUAGE_MODEL_ID;
    case "desktop":
      return DEFAULT_DESKTOP_LANGUAGE_MODEL_ID;
  }
}
