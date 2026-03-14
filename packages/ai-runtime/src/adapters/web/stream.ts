import type {
  LanguageModelV3CallOptions,
  LanguageModelV3StreamResult,
} from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import { TextStreamer } from "@huggingface/transformers";
import {
  createWebTextStreamResult,
  getPromptLength,
  prepareWebInputs,
} from "@/adapters/web/common";
import { decodeGeneratedText } from "@/adapters/web/decode";
import { mapGenerateOptions } from "@/adapters/web/options";

type GenerateWebChatParams = {
  model: PreTrainedModel;
  processor: Processor;
  options: LanguageModelV3CallOptions;
  onToken?: (token: string) => void;
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
  const { inputs, tokenizer } = await prepareWebInputs(processor, options);

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
  const promptLength = getPromptLength(inputs);

  return promptLength != null
    ? (decodeGeneratedText(processor, outputs, promptLength) ?? streamed)
    : streamed;
};

// Creates an AI SDK v3 stream result for plain (non-structured) text generation.
export const createWebStream = (
  model: PreTrainedModel,
  processor: Processor,
  options: LanguageModelV3CallOptions,
): Promise<LanguageModelV3StreamResult> =>
  createWebTextStreamResult(async (emitTextDelta) => {
    await generateWebChat({
      model,
      processor,
      options,
      onToken: emitTextDelta,
    });
  });
