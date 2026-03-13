import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { createWebStream } from "./stream";

export const createWebLanguageModelAdapter = (
  model: PreTrainedModel,
  processor: Processor,
): LanguageModelV3 => ({
  specificationVersion: "v3",
  provider: "hydrowise",
  modelId: "web",
  supportedUrls: {},
  doGenerate: () => { throw new Error("Web adapter is stream-only."); },
  doStream: (options) => createWebStream(model, processor, options),
});
