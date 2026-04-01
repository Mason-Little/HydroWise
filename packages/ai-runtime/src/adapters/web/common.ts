import type {
  LanguageModelV3CallOptions,
  LanguageModelV3StreamResult,
} from "@ai-sdk/provider";
import type { Processor } from "@huggingface/transformers";
import { toConversation } from "@/adapters/web/prompt";

export const WEB_PROVIDER = "hydrowise" as const;
export const WEB_MODEL_ID = "web" as const;

export const emptyUsage = {
  inputTokens: {
    total: undefined,
    noCache: undefined,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: undefined, text: undefined, reasoning: undefined },
  raw: undefined,
};

export const finishReason = { unified: "stop" as const, raw: undefined };

export const prepareWebInputs = async (
  processor: Processor,
  options: LanguageModelV3CallOptions,
) => {
  const conversation = toConversation(options.prompt);
  const text = processor.apply_chat_template(conversation, {
    add_generation_prompt: true,
  });
  const inputs = await processor(text);
  const { tokenizer } = processor;

  if (!tokenizer) {
    throw new Error("Web processor tokenizer is unavailable.");
  }

  return { inputs, tokenizer };
};

export const getPromptLength = (inputs: { input_ids: { dims?: number[] } }) =>
  inputs.input_ids.dims?.at(-1) ?? inputs.input_ids.dims?.[1];

type EmitTextDelta = (delta: string) => void;

export const createWebTextStreamResult = (
  run: (emitTextDelta: EmitTextDelta) => Promise<void>,
): Promise<LanguageModelV3StreamResult> => {
  const id = crypto.randomUUID();
  const textId = `text-${id}`;
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue({ type: "stream-start", warnings: [] });
      controller.enqueue({
        type: "response-metadata",
        id,
        modelId: `${WEB_PROVIDER}:${WEB_MODEL_ID}`,
        timestamp: new Date(),
      });
      controller.enqueue({ type: "text-start", id: textId });

      try {
        await run((delta) => {
          controller.enqueue({
            type: "text-delta",
            id: textId,
            delta,
          });
        });
        controller.enqueue({ type: "text-end", id: textId });
        controller.enqueue({ type: "finish", usage: emptyUsage, finishReason });
      } catch (error) {
        controller.enqueue({ type: "error", error });
      } finally {
        controller.close();
      }
    },
  });

  return Promise.resolve({ stream });
};
