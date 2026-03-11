import {
  DEFAULT_DESKTOP_LANGUAGE_MODEL_ID,
  DEFAULT_WEB_LANGUAGE_MODEL_ID,
  LANGUAGE_MODELS,
  type LanguageModelDefinition,
  type LanguageModelId,
} from "./definitions";

const languageModelById = Object.fromEntries(
  LANGUAGE_MODELS.map((model) => [model.id, model]),
) as Record<LanguageModelId, LanguageModelDefinition>;

export const getLanguageModelDefinition = (
  id: LanguageModelId,
): LanguageModelDefinition => languageModelById[id];

export const getLanguageModels = (): readonly LanguageModelDefinition[] => {
  return LANGUAGE_MODELS;
};

export const getDefaultLanguageModelId = (
  runtime: "web" | "desktop",
): LanguageModelId => {
  switch (runtime) {
    case "web":
      return DEFAULT_WEB_LANGUAGE_MODEL_ID;
    case "desktop":
      return DEFAULT_DESKTOP_LANGUAGE_MODEL_ID;
  }
};
