import { env } from "@huggingface/transformers";
import type {
  LanguageModelDefinition,
  LanguageModelTier,
} from "@/config/definitions";
import { getLanguageModels } from "@/config/queries";

const WEB_MODEL_CACHE_KEY = "hydrowise-model-cache";

const getWebModelCache = async () => {
  initWebModelCache();
  return caches.open(WEB_MODEL_CACHE_KEY);
};

const getWebModelEntries = (): [
  LanguageModelTier,
  LanguageModelDefinition,
][] => {
  return Object.entries(getLanguageModels()) as [
    LanguageModelTier,
    LanguageModelDefinition,
  ][];
};

const isModelCachedRequest = (url: string, modelId: string) => {
  return url.includes(`/${modelId}/`);
};

export const initWebModelCache = () => {
  env.useBrowserCache = true;
  env.cacheKey = WEB_MODEL_CACHE_KEY;
};

export const listWebModelCacheKeys = async (): Promise<string[]> => {
  const cache = await getWebModelCache();
  const requests = await cache.keys();
  return requests.map((request) => request.url);
};

export const listCachedWebModelTiers = async (): Promise<
  LanguageModelTier[]
> => {
  const keys = await listWebModelCacheKeys();

  return getWebModelEntries()
    .filter(([, definition]) => {
      const modelId = definition.web?.modelId;

      if (!modelId) {
        return false;
      }

      return keys.some((url) => isModelCachedRequest(url, modelId));
    })
    .map(([tier]) => tier);
};

// Returns true if the given ONNX model id has any files in the browser cache.
export const isWebModelCached = async (modelId: string): Promise<boolean> => {
  const keys = await listWebModelCacheKeys();
  return keys.some((url) => isModelCachedRequest(url, modelId));
};
