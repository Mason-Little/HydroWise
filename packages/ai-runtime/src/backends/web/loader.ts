import type { ProgressInfo } from "@huggingface/transformers";
import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
} from "@huggingface/transformers";
import { initWebModelCache } from "@/backends/web/cache";
import type { LanguageModelTier } from "@/config/definitions";
import { getLanguageModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/manager";

function toDownloadProgress(info: ProgressInfo): DownloadProgress | null {
  if (info.status === "progress" && "loaded" in info && "total" in info) {
    return {
      bytesDownloaded: info.loaded,
      bytesTotal: info.total,
      progress: info.progress / 100,
    };
  }
  if (info.status === "progress_total" && "loaded" in info && "total" in info) {
    return {
      bytesDownloaded: info.loaded,
      bytesTotal: info.total,
      progress: info.progress / 100,
    };
  }
  return null;
}

export const downloadWebModel = async (
  tier: LanguageModelTier,
  callbacks?: { onProgress?: (progress: DownloadProgress) => void },
) => {
  initWebModelCache();

  const definition = getLanguageModelDefinition(tier);

  if (!definition?.webModelId) {
    throw new Error(`Model ${tier} is not available on web.`);
  }

  const progressCallback =
    callbacks?.onProgress &&
    ((info: ProgressInfo) => {
      const progress = toDownloadProgress(info);
      if (progress) callbacks.onProgress?.(progress);
    });

  const processor = await AutoProcessor.from_pretrained(definition.webModelId, {
    progress_callback: progressCallback,
  });

  const model = await Qwen3_5ForConditionalGeneration.from_pretrained(
    definition.webModelId,
    {
      dtype: {
        embed_tokens: "q4",
        vision_encoder: "fp16",
        decoder_model_merged: "q4",
      },
      device: "webgpu",
      progress_callback: progressCallback,
    },
  );

  return { processor, model };
};
