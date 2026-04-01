import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import {
  type CompiledGrammar,
  GrammarCompiler,
  GrammarMatcher,
  TokenizerInfo,
} from "@mlc-ai/web-xgrammar";
import type {
  StructuredRuntimeContext,
  XGrammarCompiledSchema,
  XGrammarMatcherHandle,
  XGrammarRuntime,
} from "@/adapters/web/structured/types";

type TokenizerMetadata = {
  encodedVocab: string[];
  prependSpaceInTokenization: boolean;
  stopTokenIds: number[];
  vocabSize: number;
  vocabType: "byte_fallback" | "byte_level" | "raw";
};

type InternalCompiledSchema = XGrammarCompiledSchema & {
  compiledGrammar: CompiledGrammar;
};

// Derives the effective vocab size from the model config, falling back to the highest token id.
const resolveVocabSize = (
  model: PreTrainedModel,
  tokenizer: NonNullable<Processor["tokenizer"]>,
): number => {
  const vocabEntries = Array.from(tokenizer.get_vocab().entries());
  const highestTokenId = vocabEntries.reduce(
    (maxTokenId, [, tokenId]) => Math.max(maxTokenId, tokenId),
    -1,
  );
  const modelConfig = model.config as unknown as Record<string, unknown> & {
    text_config?: Record<string, unknown>;
  };
  const configuredVocabSize =
    (typeof modelConfig.text_config?.vocab_size === "number"
      ? modelConfig.text_config.vocab_size
      : undefined) ??
    (typeof modelConfig.vocab_size === "number"
      ? modelConfig.vocab_size
      : undefined);
  const vocabSize = Math.max(configuredVocabSize ?? 0, highestTokenId + 1);

  if (vocabSize <= 0) {
    throw new Error("Unable to determine tokenizer vocab size for XGrammar.");
  }

  return vocabSize;
};

// Builds the full encoded-vocab string array indexed by token id.
const buildEncodedVocab = (
  tokenizer: NonNullable<Processor["tokenizer"]>,
  vocabSize: number,
): string[] => {
  const encodedVocab = Array.from({ length: vocabSize }, () => "");
  for (const [token, tokenId] of tokenizer.get_vocab().entries()) {
    encodedVocab[tokenId] = token;
  }
  return encodedVocab;
};

// Determines the vocabulary encoding type used by this tokenizer.
const detectVocabType = (
  tokenizerJson: Record<string, unknown> | undefined,
): "byte_fallback" | "byte_level" | "raw" => {
  const tokenizerModel = tokenizerJson?.model as
    | Record<string, unknown>
    | undefined;
  const preTokenizer = tokenizerJson?.pre_tokenizer as
    | Record<string, unknown>
    | undefined;
  const decoder = tokenizerJson?.decoder as Record<string, unknown> | undefined;

  if (tokenizerModel?.byte_fallback === true) return "byte_fallback";
  if (decoder?.type === "ByteLevel" || preTokenizer?.type === "ByteLevel")
    return "byte_level";
  return "raw";
};

// Returns whether this tokenizer prepends a space before the first token.
const detectPrependSpace = (
  tokenizerConfig: Record<string, unknown> | undefined,
  preTokenizer: Record<string, unknown> | undefined,
): boolean =>
  tokenizerConfig?.add_prefix_space === true ||
  preTokenizer?.add_prefix_space === true ||
  preTokenizer?.prepend_scheme === "always";

// Extracts all metadata needed by XGrammar's TokenizerInfo from HuggingFace tokenizer internals.
const getTokenizerMetadata = (
  model: PreTrainedModel,
  tokenizer: NonNullable<Processor["tokenizer"]>,
): TokenizerMetadata => {
  const tokenizerWithInternals = tokenizer as Processor["tokenizer"] & {
    _tokenizerConfig?: Record<string, unknown>;
    _tokenizerJSON?: Record<string, unknown>;
  };
  const tokenizerJson = tokenizerWithInternals._tokenizerJSON;
  const tokenizerConfig = tokenizerWithInternals._tokenizerConfig;
  const preTokenizer = tokenizerJson?.pre_tokenizer as
    | Record<string, unknown>
    | undefined;

  const vocabSize = resolveVocabSize(model, tokenizer);
  const encodedVocab = buildEncodedVocab(tokenizer, vocabSize);
  const vocabType = detectVocabType(tokenizerJson);
  const prependSpaceInTokenization = detectPrependSpace(
    tokenizerConfig,
    preTokenizer,
  );
  const stopTokenIds = [tokenizer.eos_token_id]
    .flat()
    .filter((tokenId): tokenId is number => typeof tokenId === "number");

  return {
    encodedVocab,
    prependSpaceInTokenization,
    stopTokenIds,
    vocabSize,
    vocabType,
  };
};

// Wraps a compiled grammar with its cache key and a dispose method.
const createCompiledSchema = (
  cacheKey: string,
  compiledGrammar: CompiledGrammar,
): InternalCompiledSchema => ({
  cacheKey,
  compiledGrammar,
  dispose: () => compiledGrammar.dispose(),
});

// Narrows an XGrammarCompiledSchema to the internal type that carries the compiled grammar handle.
const toInternalCompiledSchema = (
  compiledSchema: XGrammarCompiledSchema,
): InternalCompiledSchema => {
  if (!("compiledGrammar" in compiledSchema)) {
    throw new Error("Expected an internal compiled grammar handle.");
  }

  return compiledSchema as InternalCompiledSchema;
};

// Initializes the XGrammar runtime by building tokenizer metadata and a GrammarCompiler instance.
export const createXGrammarRuntime = async (
  context: StructuredRuntimeContext,
): Promise<XGrammarRuntime> => {
  const metadata = getTokenizerMetadata(context.model, context.tokenizer);

  // Keep all direct web-xgrammar integration details isolated here so that
  // package-version adjustments only affect a single boundary.
  const tokenizerInfo = await TokenizerInfo.createTokenizerInfo(
    metadata.encodedVocab,
    metadata.vocabType,
    metadata.prependSpaceInTokenization,
    metadata.vocabSize,
    metadata.stopTokenIds,
  );
  const compiler = await GrammarCompiler.createGrammarCompiler(
    tokenizerInfo,
    true,
  );

  return {
    vocabSize: metadata.vocabSize,
    // Compiles the built-in generic JSON grammar for unconstrained JSON output.
    async compileBuiltinJson(cacheKey) {
      const compiledGrammar = await compiler.compileBuiltinJSONGrammar();
      return createCompiledSchema(cacheKey, compiledGrammar);
    },
    // Compiles a user-supplied JSON Schema into a grammar for constrained output.
    async compileJsonSchema(cacheKey, schemaText) {
      const compiledGrammar = await compiler.compileJSONSchema(
        schemaText,
        false,
        -1,
        [",", ":"],
        true,
      );
      return createCompiledSchema(cacheKey, compiledGrammar);
    },
    // Creates a per-request grammar matcher seeded with the compiled schema and stop token ids.
    async createRequestMatcher(compiledSchema, stopTokenIds) {
      const internalCompiledSchema = toInternalCompiledSchema(compiledSchema);
      const matcher = await GrammarMatcher.createGrammarMatcher(
        internalCompiledSchema.compiledGrammar,
        stopTokenIds.length > 0 ? [...stopTokenIds] : undefined,
        false,
      );

      const handle: XGrammarMatcherHandle = {
        acceptToken: (tokenId) => matcher.acceptToken(tokenId),
        dispose: () => matcher.dispose(),
        getNextTokenBitmask: () => matcher.getNextTokenBitmask(),
        isTerminated: () => matcher.isTerminated(),
      };

      return handle;
    },
  };
};
