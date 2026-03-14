import type { LanguageModelV3CallOptions } from "@ai-sdk/provider";
import type { StructuredOutputDetection } from "@/adapters/web/structured/types";

// Inspects the call options and returns whether structured JSON output was requested.
export const detectStructuredOutput = (
  options: LanguageModelV3CallOptions,
): StructuredOutputDetection => {
  const responseFormat = options.responseFormat;

  if (responseFormat?.type !== "json") {
    return { kind: "plain" };
  }

  return { kind: "structured", responseFormat };
};
