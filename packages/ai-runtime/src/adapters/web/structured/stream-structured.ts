import type {
  LanguageModelV3CallOptions,
  LanguageModelV3StreamResult,
} from "@ai-sdk/provider";
import {
  BaseStreamer,
  LogitsProcessorList,
  type PreTrainedModel,
  type Processor,
} from "@huggingface/transformers";
import {
  createWebTextStreamResult,
  getPromptLength,
  prepareWebInputs,
} from "@/adapters/web/common";
import { decodeGeneratedText } from "@/adapters/web/decode";
import { mapGenerateOptions } from "@/adapters/web/options";
import {
  getCachedCompiledSchema,
  getCachedXGrammarRuntime,
} from "@/adapters/web/structured/cache";
import { StructuredOutputLogitsProcessor } from "@/adapters/web/structured/logits-processor";
import { StructuredOutputMatcher } from "@/adapters/web/structured/matcher";
import { PartialJsonAccumulator } from "@/adapters/web/structured/partial-json";
import { normalizeStructuredSchema } from "@/adapters/web/structured/schema";
import type {
  StructuredResponseFormat,
  XGrammarCompiledSchema,
  XGrammarRuntime,
} from "@/adapters/web/structured/types";

class StructuredTextStreamer extends BaseStreamer {
  private emittedText = "";
  private generatedTokens: bigint[] = [];
  private skippingPrompt = true;

  constructor(
    private readonly tokenizer: NonNullable<Processor["tokenizer"]>,
    private readonly onTextDelta: (delta: string) => void,
    private readonly onTokens: (tokens: readonly bigint[]) => void,
  ) {
    super();
  }

  put(value: bigint[][]) {
    if (value.length !== 1) {
      throw new Error(
        `Structured output only supports batch size 1. Received ${value.length}.`,
      );
    }

    if (this.skippingPrompt) {
      this.skippingPrompt = false;
      return;
    }

    const tokens = value[0] ?? [];
    if (tokens.length === 0) {
      return;
    }

    this.onTokens(tokens);
    this.generatedTokens.push(...tokens);
    this.flushDecodedText();
  }

  end() {
    this.flushDecodedText();
  }

  getText() {
    return this.emittedText;
  }

  private flushDecodedText() {
    const decoded = this.tokenizer.decode(this.generatedTokens, {
      clean_up_tokenization_spaces: false,
      skip_special_tokens: true,
    });
    const delta = decoded.slice(this.emittedText.length);

    if (delta.length > 0) {
      this.emittedText = decoded;
      this.onTextDelta(delta);
    }
  }
}

const getStructuredStopTokenIds = (
  tokenizer: NonNullable<Processor["tokenizer"]>,
) => {
  const stopTokenIds = [tokenizer.eos_token_id]
    .flat()
    .filter((tokenId): tokenId is number => typeof tokenId === "number");

  return [...new Set(stopTokenIds)];
};

const buildGrammarMatcher = async (
  runtime: XGrammarRuntime,
  compiledSchema: XGrammarCompiledSchema,
  tokenizer: NonNullable<Processor["tokenizer"]>,
): Promise<StructuredOutputMatcher> => {
  const matcherHandle = await runtime.createRequestMatcher(
    compiledSchema,
    getStructuredStopTokenIds(tokenizer),
  );
  const matcher = new StructuredOutputMatcher(runtime.vocabSize, matcherHandle);
  await matcher.prime();
  return matcher;
};

type GenerationSetup = {
  logitsProcessor: LogitsProcessorList;
  partialJson: PartialJsonAccumulator;
  streamer: StructuredTextStreamer;
};

const buildGenerationSetup = (
  tokenizer: NonNullable<Processor["tokenizer"]>,
  matcher: StructuredOutputMatcher,
  onToken: ((token: string) => void) | undefined,
): GenerationSetup => {
  const partialJson = new PartialJsonAccumulator();
  const streamer = new StructuredTextStreamer(
    tokenizer,
    (delta) => {
      partialJson.append(delta);
      onToken?.(delta);
    },
    (tokens) => matcher.acceptGeneratedTokens(tokens),
  );
  const logitsProcessor = new LogitsProcessorList();
  logitsProcessor.push(new StructuredOutputLogitsProcessor(matcher));
  return { logitsProcessor, partialJson, streamer };
};

const resolveOutputText = (
  processor: Processor,
  inputs: Awaited<ReturnType<typeof prepareWebInputs>>["inputs"],
  outputs: Awaited<ReturnType<PreTrainedModel["generate"]>>,
  streamer: StructuredTextStreamer,
  partialJson: PartialJsonAccumulator,
): string => {
  const promptLength = getPromptLength(inputs);
  const decodedOutput =
    promptLength != null
      ? decodeGeneratedText(processor, outputs, promptLength)
      : streamer.getText();
  const finalText =
    decodedOutput || partialJson.getText() || streamer.getText();

  if (finalText !== partialJson.getText()) {
    partialJson.append(finalText.slice(partialJson.getText().length));
  }

  partialJson.finalize();
  return finalText;
};

type GenerateStructuredChatParams = {
  model: PreTrainedModel;
  onToken?: (token: string) => void;
  options: LanguageModelV3CallOptions;
  processor: Processor;
  responseFormat: StructuredResponseFormat;
};

const generateStructuredChat = async ({
  model,
  onToken,
  options,
  processor,
  responseFormat,
}: GenerateStructuredChatParams): Promise<string> => {
  const { inputs, tokenizer } = await prepareWebInputs(processor, options);
  const normalizedSchema = normalizeStructuredSchema(responseFormat);
  const runtime = await getCachedXGrammarRuntime({
    model,
    processor,
    tokenizer,
  });
  const compiledSchema = await getCachedCompiledSchema(
    { model, processor, tokenizer },
    normalizedSchema,
  );
  const matcher = await buildGrammarMatcher(runtime, compiledSchema, tokenizer);
  const { streamer, logitsProcessor, partialJson } = buildGenerationSetup(
    tokenizer,
    matcher,
    onToken,
  );

  try {
    const outputs = await model.generate({
      ...inputs,
      ...mapGenerateOptions(options),
      logits_processor: logitsProcessor,
      streamer,
    });

    if (!matcher.isTerminated()) {
      throw new Error(
        "Structured generation finished before the grammar matcher reached termination.",
      );
    }

    return resolveOutputText(processor, inputs, outputs, streamer, partialJson);
  } finally {
    matcher.dispose();
  }
};

export const createStructuredWebStream = (
  model: PreTrainedModel,
  processor: Processor,
  options: LanguageModelV3CallOptions,
  responseFormat: StructuredResponseFormat,
): Promise<LanguageModelV3StreamResult> =>
  createWebTextStreamResult(async (emitTextDelta) => {
    await generateStructuredChat({
      model,
      onToken: emitTextDelta,
      options,
      processor,
      responseFormat,
    });
  });
