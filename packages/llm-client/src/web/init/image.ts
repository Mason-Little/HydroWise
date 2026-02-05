import type { Processor, ProgressInfo } from "@huggingface/transformers";
import {
  AutoProcessor,
  Florence2ForConditionalGeneration,
} from "@huggingface/transformers";

const MODEL_ID = "onnx-community/Florence-2-large-ft";

const state: {
  model: Florence2ForConditionalGeneration | null;
  processor: Processor | null;
  initPromise: Promise<void> | null;
} = {
  model: null,
  processor: null,
  initPromise: null,
};

export const initWebVisionModel = async (
  onProgress?: (progress: number) => void,
): Promise<void> => {
  if (state.model && state.processor) {
    onProgress?.(100);
    return;
  }
  if (state.initPromise) return state.initPromise;

  state.initPromise = (async () => {
    try {
      state.model = (await Florence2ForConditionalGeneration.from_pretrained(
        MODEL_ID,
        {
          device: "webgpu",
          dtype: {
            embed_tokens: "fp32",
            vision_encoder: "fp32",
            encoder_model: "q4",
            decoder_model_merged: "q4",
          },
          progress_callback: (data: ProgressInfo) => {
            if (data.status === "progress" && onProgress) {
              onProgress(Math.round(data.progress || 0));
            }
          },
        },
      )) as Florence2ForConditionalGeneration;

      state.processor = await AutoProcessor.from_pretrained(MODEL_ID, {
        progress_callback: (data: ProgressInfo) => {
          if (data.status === "progress" && onProgress) {
            onProgress(Math.round(data.progress || 0));
          }
        },
      });

      onProgress?.(100);
    } catch (error) {
      console.error("Failed to initialize vision model:", error);
      state.initPromise = null;
      throw error;
    }
  })();

  return state.initPromise;
};

export const getWebVisionModel = (): Florence2ForConditionalGeneration => {
  if (!state.model) throw new Error("Vision model still initializing");
  return state.model;
};

export const getWebVisionProcessor = () => {
  if (!state.processor) throw new Error("Vision processor still initializing");
  return state.processor;
};
