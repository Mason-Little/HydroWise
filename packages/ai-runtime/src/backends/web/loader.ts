import { AutoModel, AutoProcessor } from "@huggingface/transformers";
import type { WebAutoModelDef } from "@/config/definitions";
import type { DownloadProgress } from "@/managers/types";
import { makeWebProgressCallback } from "./progress";

type WebAutoModelRequest = {
  web: WebAutoModelDef;
  onProgress?: (progress: DownloadProgress) => void;
};

// Downloads all model files to cache without initialising the ONNX runtime.
// Safe to call before the user has triggered a warm — no WebGPU work happens here.
export const downloadWebModel = async (request: WebAutoModelRequest) => {
  const { modelId, config } = request.web;
  const progressCallback = makeWebProgressCallback(request.onProgress);

  await AutoProcessor.from_pretrained(modelId, {
    progress_callback: progressCallback,
  });

  await AutoModel.from_pretrained(modelId, {
    dtype: config,
    device: "webgpu",
    progress_callback: progressCallback,
    // @ts-expect-error — patched option: skips createInferenceSession, downloads only
    downloadOnly: true,
  });
};

// Loads the already-cached model into the ONNX runtime / WebGPU. No network traffic.
export const warmWebModel = async (request: WebAutoModelRequest) => {
  const { modelId, config } = request.web;
  const progressCallback = makeWebProgressCallback(request.onProgress);

  const [processor, model] = await Promise.all([
    AutoProcessor.from_pretrained(modelId, {
      progress_callback: progressCallback,
    }),
    AutoModel.from_pretrained(modelId, {
      dtype: config,
      device: "webgpu",
      progress_callback: progressCallback,
    }),
  ]);

  return { processor, model };
};
