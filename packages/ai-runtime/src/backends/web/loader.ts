import type { ProgressInfo } from "@huggingface/transformers";
import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
} from "@huggingface/transformers";
import type { LanguageModelTier } from "@/config/definitions";
import { getLanguageModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/manager";

type WebModelRequest = {
  tier: LanguageModelTier;
  onProgress?: (progress: DownloadProgress) => void;
};

const MODEL_DTYPE = {
  embed_tokens: "q4",
  vision_encoder: "fp16",
  decoder_model_merged: "q4",
} as const;

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

function getModelId(tier: LanguageModelTier): string {
  const definition = getLanguageModelDefinition(tier);
  if (!definition?.webModelId) {
    throw new Error(`Model ${tier} is not available on web.`);
  }
  return definition.webModelId;
}

function makeProgressCallback(
  onProgress?: (progress: DownloadProgress) => void,
) {
  return (
    onProgress &&
    ((info: ProgressInfo) => {
      const progress = toDownloadProgress(info);
      if (progress) onProgress(progress);
    })
  );
}

// Downloads all model files to cache without initialising the ONNX runtime.
// Safe to call before the user has triggered a warm — no WebGPU work happens here.
export const downloadWebModel = async (request: WebModelRequest) => {
  const modelId = getModelId(request.tier);
  const progressCallback = makeProgressCallback(request.onProgress);

  await AutoProcessor.from_pretrained(modelId, {
    progress_callback: progressCallback,
  });

  await Qwen3_5ForConditionalGeneration.from_pretrained(modelId, {
    dtype: MODEL_DTYPE,
    device: "webgpu",
    progress_callback: progressCallback,
    // @ts-expect-error — patched option: skips createInferenceSession, downloads only
    downloadOnly: true,
  });
};

// Loads the already-cached model into the ONNX runtime / WebGPU. No network traffic.
export const warmWebModel = async (request: WebModelRequest) => {
  const modelId = getModelId(request.tier);
  const progressCallback = makeProgressCallback(request.onProgress);

  const processor = await AutoProcessor.from_pretrained(modelId, {
    progress_callback: progressCallback,
  });

  const model = await Qwen3_5ForConditionalGeneration.from_pretrained(modelId, {
    dtype: MODEL_DTYPE,
    device: "webgpu",
    progress_callback: progressCallback,
  });

  return { processor, model };
};
