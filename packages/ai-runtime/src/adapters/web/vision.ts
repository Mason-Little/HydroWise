import type {
  LanguageModelV3,
  LanguageModelV3FilePart,
} from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { runWebOcr } from "./ocr";

// Implements LanguageModelV3 using a locally-loaded ONNX vision model.
// The OCR model is a multimodal LLM — vision in, text out — so callers can use
// standard generateText() with a base64 PNG file content part.
export const createWebVisionAdapter = (
  model: PreTrainedModel,
  processor: Processor,
): LanguageModelV3 => ({
  specificationVersion: "v3",
  provider: "hydrowise",
  modelId: "web-vision",
  supportedUrls: {},
  doGenerate: async (options) => {
    const filePart = options.prompt
      .flatMap((msg) =>
        msg.role === "user" ? (msg.content as LanguageModelV3FilePart[]) : [],
      )
      .find((part): part is LanguageModelV3FilePart => part.type === "file");

    if (!filePart || typeof filePart.data !== "string") {
      throw new Error("Web vision adapter requires a base64 PNG image.");
    }

    const text = await runWebOcr(model, processor, filePart.data);

    return {
      content: [{ type: "text" as const, text }],
      finishReason: { unified: "stop" as const, raw: undefined },
      usage: {
        inputTokens: {
          total: undefined,
          noCache: undefined,
          cacheRead: undefined,
          cacheWrite: undefined,
        },
        outputTokens: { total: undefined, text: undefined, reasoning: undefined },
      },
      warnings: [],
    };
  },
  doStream: () => {
    throw new Error("Web vision adapter is generate-only.");
  },
});
