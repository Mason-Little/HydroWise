import type { PreTrainedModel, Processor } from "@huggingface/transformers";
import type {
  NormalizedStructuredSchema,
  StructuredRuntimeContext,
  XGrammarCompiledSchema,
  XGrammarRuntime,
} from "@/adapters/web/structured/types";
import { createXGrammarRuntime } from "@/adapters/web/structured/xgrammar";

type RuntimeCacheEntry = {
  compiledSchemas: Map<string, Promise<XGrammarCompiledSchema>>;
  runtime: Promise<XGrammarRuntime>;
};

const runtimeCache = new WeakMap<
  PreTrainedModel,
  WeakMap<NonNullable<Processor["tokenizer"]>, RuntimeCacheEntry>
>();

// Looks up or creates the runtime cache entry for the given model+tokenizer pair.
const getRuntimeCacheEntry = (
  context: StructuredRuntimeContext,
): RuntimeCacheEntry => {
  let tokenizersByModel = runtimeCache.get(context.model);

  if (!tokenizersByModel) {
    tokenizersByModel = new WeakMap();
    runtimeCache.set(context.model, tokenizersByModel);
  }

  let entry = tokenizersByModel.get(context.tokenizer);

  if (!entry) {
    const runtime = createXGrammarRuntime(context);
    entry = {
      compiledSchemas: new Map(),
      runtime: runtime.catch((error) => {
        tokenizersByModel.delete(context.tokenizer);
        throw error;
      }),
    };
    tokenizersByModel.set(context.tokenizer, entry);
  }

  return entry;
};

// Returns the cached XGrammar runtime for the given model+tokenizer, creating it if needed.
export const getCachedXGrammarRuntime = async (
  context: StructuredRuntimeContext,
) => getRuntimeCacheEntry(context).runtime;

// Returns a cached compiled grammar schema, compiling it on first use.
export const getCachedCompiledSchema = async (
  context: StructuredRuntimeContext,
  normalizedSchema: NormalizedStructuredSchema,
) => {
  const entry = getRuntimeCacheEntry(context);
  const runtime = await entry.runtime;
  const cached = entry.compiledSchemas.get(normalizedSchema.cacheKey);

  if (cached) {
    return cached;
  }

  const compiledSchemaPromise = (
    normalizedSchema.mode === "builtin-json"
      ? runtime.compileBuiltinJson(normalizedSchema.cacheKey)
      : runtime.compileJsonSchema(
          normalizedSchema.cacheKey,
          normalizedSchema.schemaText ?? "{}",
        )
  ).catch((error) => {
    entry.compiledSchemas.delete(normalizedSchema.cacheKey);
    throw error;
  });

  entry.compiledSchemas.set(normalizedSchema.cacheKey, compiledSchemaPromise);
  return compiledSchemaPromise;
};
