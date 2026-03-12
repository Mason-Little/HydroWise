import type { ProgressInfo } from "@huggingface/transformers";
import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
} from "@huggingface/transformers";
import type { LanguageModelTier } from "@/config/definitions";
import { getLanguageModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/manager";

type DownloadWebModelRequest = {
  tier: LanguageModelTier;
  onProgress?: (progress: DownloadProgress) => void;
};

// Maps HuggingFace ProgressInfo to our DownloadProgress when status is progress.
function toDownloadProgress(info: ProgressInfo): DownloadProgress | null {
  if (
    (info.status === "progress" || info.status === "progress_total") &&
    "loaded" in info &&
    "total" in info
  ) {
    return {
      bytesDownloaded: info.loaded,
      bytesTotal: info.total,
      progress: info.progress / 100,
    };
  }
  return null;
}

// Loads the tier's ONNX model and processor from HuggingFace with optional progress.
export const downloadWebModel = async (request: DownloadWebModelRequest) => {
  const definition = getLanguageModelDefinition(request.tier);

  if (!definition?.webModelId) {
    throw new Error(`Model ${request.tier} is not available on web.`);
  }

  const progressCallback =
    request.onProgress &&
    ((info: ProgressInfo) => {
      const progress = toDownloadProgress(info);
      if (progress) request.onProgress?.(progress);
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
