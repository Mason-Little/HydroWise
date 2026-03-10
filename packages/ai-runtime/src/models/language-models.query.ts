import type { AiRuntime } from "@/init/runtime";
import {
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

export function getLanguageModelsForRuntime(runtime: AiRuntime) {
  return LANGUAGE_MODELS.filter((model) =>
    runtime === "web" ? model.web.enabled : model.desktop.enabled,
  );
}
