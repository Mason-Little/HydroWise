import type {
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3GenerateResult,
  LanguageModelV3StreamResult,
  ProviderV3,
} from "@ai-sdk/provider";
import { customProvider } from "ai";
import { generateWebChat } from "../backends/web/chat";
import { toWebChatMessages } from "./message-conversions";

const PROVIDER = "hydrowise" as const;
const MODEL_ID = "web" as const;

// Usage tokens are unavailable for locally-run web models.
const emptyUsage = {
  inputTokens: {
    total: undefined,
    noCache: undefined,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: undefined, text: undefined, reasoning: undefined },
  raw: undefined,
};

function mapGenerateOptions(options: LanguageModelV3CallOptions) {
  return {
    maxNewTokens: options.maxOutputTokens ?? 256,
    temperature: options.temperature ?? 0.7,
    topP: options.topP ?? 0.8,
    topK: options.topK,
  };
}

export function createWebLanguageModel(): LanguageModelV3 {
  return {
    specificationVersion: "v3",
    provider: PROVIDER,
    modelId: MODEL_ID,
    supportedUrls: {},

    async doGenerate(
      options: LanguageModelV3CallOptions,
    ): Promise<LanguageModelV3GenerateResult> {
      const messages = toWebChatMessages(options.prompt);
      const text = await generateWebChat({
        messages,
        ...mapGenerateOptions(options),
      });

      return {
        content: [{ type: "text", text }],
        finishReason: { unified: "stop", raw: undefined },
        usage: emptyUsage,
        warnings: [],
      };
    },

    async doStream(
      options: LanguageModelV3CallOptions,
    ): Promise<LanguageModelV3StreamResult> {
      const messages = toWebChatMessages(options.prompt);
      const id = crypto.randomUUID();

      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue({ type: "stream-start", warnings: [] });
          controller.enqueue({
            type: "response-metadata",
            id,
            modelId: `${PROVIDER}:${MODEL_ID}`,
            timestamp: new Date(),
          });

          await generateWebChat({
            messages,
            ...mapGenerateOptions(options),
            onToken(token) {
              controller.enqueue({
                type: "text-delta",
                id,
                delta: token,
              });
            },
          });

          controller.enqueue({
            type: "finish",
            usage: emptyUsage,
            finishReason: { unified: "stop", raw: undefined },
          });
          controller.close();
        },
      });

      return { stream };
    },
  };
}

export const createHydroWiseModel = createWebLanguageModel;

export function hydrowiseProvider(): ProviderV3 {
  return customProvider({
    languageModels: {
      "hydrowise:web": createWebLanguageModel(),
    },
  });
}
