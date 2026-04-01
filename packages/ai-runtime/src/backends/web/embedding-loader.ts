import type { FeatureExtractionPipeline } from "@huggingface/transformers";
import { pipeline } from "@huggingface/transformers";
import { getEmbeddingModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/types";
import { makeWebProgressCallback } from "./progress";

// Downloads the embedding model files to the browser cache without loading.
export const downloadWebEmbeddingModel = async (
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> => {
  const { web } = getEmbeddingModelDefinition();
  const progressCallback = makeWebProgressCallback(onProgress);

  await pipeline("feature-extraction", web.modelId, {
    dtype: web.config,
    device: "webgpu",
    progress_callback: progressCallback,
    // @ts-expect-error — patched option: skips createInferenceSession, downloads only
    downloadOnly: true,
  });
};

// Loads the cached embedding model into the ONNX runtime / WebGPU.
export const warmWebEmbeddingModel =
  async (): Promise<FeatureExtractionPipeline> => {
    const { web } = getEmbeddingModelDefinition();

    return (await pipeline("feature-extraction", web.modelId, {
      dtype: web.config,
      device: "webgpu",
    })) as FeatureExtractionPipeline;
  };
