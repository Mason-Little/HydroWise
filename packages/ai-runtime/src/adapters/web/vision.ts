import type {
  LanguageModelV3,
  LanguageModelV3FilePart,
} from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { runWebOcr } from "./ocr";

// Implements LanguageModelV3 using a locally-loaded ONNX vision model.
// The OCR model is a multimodal LLM — vision in, text out — so callers can use
// standard generateText() with an ArrayBuffer PNG image part.
//
// Note: generateText() normalizes image parts (ArrayBuffer) to file parts
// (Uint8Array) before reaching doGenerate, so we filter for type "file" here.
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

    if (!filePart || !(filePart.data instanceof Uint8Array)) {
      throw new Error(
        "Web vision adapter requires a Uint8Array image file part.",
      );
    }

    const pngBytes = new Uint8Array(filePart.data);
    const blob = new Blob([pngBytes], { type: "image/png" });
    const text = await runWebOcr(model, processor, blob);

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
        outputTokens: {
          total: undefined,
          text: undefined,
          reasoning: undefined,
        },
      },
      warnings: [],
    };
  },
  doStream: () => {
    throw new Error("Web vision adapter is generate-only.");
  },
});
