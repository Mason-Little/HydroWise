import type {
  LanguageModelV3CallOptions,
  LanguageModelV3StreamResult,
} from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { TextStreamer } from "@huggingface/transformers";
import { decodeGeneratedText } from "./decode";
import { mapGenerateOptions } from "./options";
import { toConversation } from "./prompt";

const PROVIDER = "hydrowise" as const;
const MODEL_ID = "web" as const;

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

const finishReason = { unified: "stop" as const, raw: undefined };

type GenerateWebChatParams = {
  model: PreTrainedModel;
  processor: Processor;
  options: LanguageModelV3CallOptions;
  onToken?: (token: string) => void;
};

const prepareInputs = async (
  processor: Processor,
  options: LanguageModelV3CallOptions,
) => {
  const conversation = toConversation(options.prompt);
  const text = processor.apply_chat_template(conversation, {
    add_generation_prompt: true,
  });
  const inputs = await processor(text);
  const { tokenizer } = processor;
  if (!tokenizer) throw new Error("Web processor tokenizer is unavailable.");
  return { inputs, tokenizer };
};

const createTokenStreamer = (
  tokenizer: NonNullable<Processor["tokenizer"]>,
  onChunk: (chunk: string) => void,
) =>
  new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: onChunk,
  });

const generateWebChat = async ({
  model,
  processor,
  options,
  onToken,
}: GenerateWebChatParams): Promise<string> => {
  const { inputs, tokenizer } = await prepareInputs(processor, options);

  let streamed = "";
  const streamer = createTokenStreamer(tokenizer, (chunk) => {
    streamed += chunk;
    onToken?.(chunk);
  });

  const outputs = await model.generate({
    ...inputs,
    ...mapGenerateOptions(options),
    streamer,
  });
  const promptLength =
    inputs.input_ids.dims?.at(-1) ?? inputs.input_ids.dims?.[1];

  return promptLength != null
    ? (decodeGeneratedText(processor, outputs, promptLength) ?? streamed)
    : streamed;
};

export const createWebStream = (
  model: PreTrainedModel,
  processor: Processor,
  options: LanguageModelV3CallOptions,
): Promise<LanguageModelV3StreamResult> => {
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
        model,
        processor,
        options,
        onToken: (token) =>
          controller.enqueue({ type: "text-delta", id, delta: token }),
      });
      controller.enqueue({ type: "finish", usage: emptyUsage, finishReason });
      controller.close();
    },
  });
  return Promise.resolve({ stream });
};
