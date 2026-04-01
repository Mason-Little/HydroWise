import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { createWebStream } from "@/adapters/web/stream";
import { detectStructuredOutput } from "@/adapters/web/structured/detect";
import { createStructuredWebStream } from "@/adapters/web/structured/stream-structured";

export const createWebLanguageModelAdapter = (
  model: PreTrainedModel,
  processor: Processor,
): LanguageModelV3 => ({
  specificationVersion: "v3",
  provider: "hydrowise",
  modelId: "web",
  supportedUrls: {},
  doGenerate: () => {
    throw new Error("Web adapter is stream-only.");
  },
  doStream: (options) => {
    const detection = detectStructuredOutput(options);

    if (detection.kind === "structured") {
      return createStructuredWebStream(
        model,
        processor,
        options,
        detection.responseFormat,
      );
    }

    return createWebStream(model, processor, options);
  },
});
