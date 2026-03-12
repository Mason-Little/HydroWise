import type {
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3GenerateResult,
  LanguageModelV3Prompt,
  LanguageModelV3StreamResult,
} from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { TextStreamer } from "@huggingface/transformers";

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

const mapGenerateOptions = (options: LanguageModelV3CallOptions) => ({
  max_new_tokens: options.maxOutputTokens ?? 256,
  temperature: options.temperature ?? 0.7,
  top_p: options.topP ?? 0.8,
  top_k: options.topK ?? 20,
});

const extractText = (
  content: string | Array<{ type: string; text?: string } & Record<string, unknown>>,
): string => {
  if (typeof content === "string") return content;
  return content
    .filter((p) => (p.type === "text" || p.type === "reasoning") && p.text != null)
    .map((p) => p.text as string)
    .join("\n");
};

const toConversation = (prompt: LanguageModelV3Prompt) =>
  prompt.flatMap((message) => {
    if (message.role === "system" || message.role === "assistant") {
      return [
        {
          role: message.role,
          content: [{ type: "text", text: extractText(message.content as string | Array<{ type: string; text?: string } & Record<string, unknown>>) }],
        },
      ];
    }

    if (message.role === "user") {
      const parts =
        typeof message.content === "string"
          ? [{ type: "text", text: message.content }]
          : message.content
              .filter((p) => p.type === "text")
              .map((p) => ({ type: "text", text: (p as { type: "text"; text: string }).text }));

      return [{ role: "user", content: parts.length > 0 ? parts : [{ type: "text", text: "" }] }];
    }

    return [];
  });

const decodeGeneratedText = (
  processor: Processor,
  outputs: any,
  promptLength: number,
) => {
  const seqLen = outputs.dims?.[1] ?? outputs.dims?.[outputs.dims?.length - 1];
  const end = seqLen != null ? seqLen : promptLength + 256;
  const sliced =
    typeof outputs.slice === "function"
      ? outputs.slice(null, [promptLength, end])
      : outputs;
  return processor.batch_decode(sliced, { skip_special_tokens: true })[0] as string;
};

const generateWebChat = async ({
  model,
  processor,
  options,
  onToken,
}: {
  model: PreTrainedModel;
  processor: Processor;
  options: LanguageModelV3CallOptions;
  onToken?: (token: string) => void;
}) => {
  const conversation = toConversation(options.prompt);
  const text = processor.apply_chat_template(conversation, {
    add_generation_prompt: true,
  });

  const inputs = await processor(text);
  const tokenizer = processor.tokenizer;

  if (!tokenizer) throw new Error("Web processor tokenizer is unavailable.");

  let streamed = "";
  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (chunk: string) => {
      streamed += chunk;
      onToken?.(chunk);
    },
  });

  const outputs = await model.generate({
    ...inputs,
    ...mapGenerateOptions(options),
    streamer,
  });

  const promptLength = inputs.input_ids.dims?.at(-1) ?? inputs.input_ids.dims?.[1];

  return promptLength != null
    ? (decodeGeneratedText(processor, outputs, promptLength) ?? streamed)
    : streamed;
};

export const createWebLanguageModelAdapter = (
  model: PreTrainedModel,
  processor: Processor,
): LanguageModelV3 => ({
  specificationVersion: "v3",
  provider: PROVIDER,
  modelId: MODEL_ID,
  supportedUrls: {},

  async doGenerate(
    options: LanguageModelV3CallOptions,
  ): Promise<LanguageModelV3GenerateResult> {
    const text = await generateWebChat({ model, processor, options });
    return {
      content: [{ type: "text", text }],
      finishReason,
      usage: emptyUsage,
      warnings: [],
    };
  },

  async doStream(
    options: LanguageModelV3CallOptions,
  ): Promise<LanguageModelV3StreamResult> {
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
          onToken: (token) => controller.enqueue({ type: "text-delta", id, delta: token }),
        });

        controller.enqueue({ type: "finish", usage: emptyUsage, finishReason });
        controller.close();
      },
    });
    return { stream };
  },
});
