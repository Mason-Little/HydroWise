import type { LanguageModelV3CallOptions } from "@ai-sdk/provider";
import type { PreTrainedModel, Processor } from "@huggingface/transformers";

export type StructuredResponseFormat = Extract<
  NonNullable<LanguageModelV3CallOptions["responseFormat"]>,
  { type: "json" }
>;

export type StructuredOutputDetection =
  | { kind: "plain" }
  | { kind: "structured"; responseFormat: StructuredResponseFormat };

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };
export type JsonSchema = JsonValue;
export type JsonObject = { [key: string]: JsonValue };

export type NormalizedStructuredSchema = {
  cacheKey: string;
  description?: string;
  mode: "builtin-json" | "json-schema";
  name?: string;
  schema?: JsonSchema;
  schemaText?: string;
};

export type StructuredRuntimeContext = {
  model: PreTrainedModel;
  processor: Processor;
  tokenizer: NonNullable<Processor["tokenizer"]>;
};

export interface XGrammarCompiledSchema {
  readonly cacheKey: string;
  dispose(): void;
}

export interface XGrammarRuntime {
  readonly vocabSize: number;
  compileBuiltinJson(cacheKey: string): Promise<XGrammarCompiledSchema>;
  compileJsonSchema(
    cacheKey: string,
    schemaText: string,
  ): Promise<XGrammarCompiledSchema>;
  createRequestMatcher(
    compiledSchema: XGrammarCompiledSchema,
    stopTokenIds: readonly number[],
  ): Promise<XGrammarMatcherHandle>;
}

export interface XGrammarMatcherHandle {
  acceptToken(tokenId: number): boolean;
  dispose(): void;
  getNextTokenBitmask(): Promise<Int32Array>;
  isTerminated(): boolean;
}

export type PreparedTokenMask = {
  acceptedTokenIds: readonly number[];
  bitmask: Int32Array;
  grammarVocabSize: number;
};

export type PartialJsonSnapshot = {
  complete: boolean;
  value?: JsonValue;
};
