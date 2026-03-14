import type {
  JsonSchema,
  JsonValue,
  NormalizedStructuredSchema,
  StructuredResponseFormat,
} from "@/adapters/web/structured/types";

// Recursively normalizes a JSON-compatible value by sorting object keys for stable serialization.
const normalizeJsonValue = (value: unknown): JsonValue => {
  if (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value as JsonValue;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonValue(item));
  }

  if (typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, JsonValue>>((result, key) => {
        const nextValue = (value as Record<string, unknown>)[key];
        if (nextValue !== undefined) {
          result[key] = normalizeJsonValue(nextValue);
        }
        return result;
      }, {});
  }

  throw new Error(`Unsupported structured schema value type: ${typeof value}.`);
};

// Serializes a normalized JSON value to a stable string for use as a cache key.
const stableStringify = (value: JsonValue) => JSON.stringify(value);

// Converts a response format into a normalized schema with a deterministic cache key.
export const normalizeStructuredSchema = (
  responseFormat: StructuredResponseFormat,
): NormalizedStructuredSchema => {
  const schema = responseFormat.schema;

  if (schema == null) {
    return {
      cacheKey: "builtin-json",
      description: responseFormat.description,
      mode: "builtin-json",
      name: responseFormat.name,
    };
  }

  const normalizedSchema = normalizeJsonValue(schema) as JsonSchema;
  const schemaText = stableStringify(normalizedSchema);

  return {
    cacheKey: `json-schema:${schemaText}`,
    description: responseFormat.description,
    mode: "json-schema",
    name: responseFormat.name,
    schema: normalizedSchema,
    schemaText,
  };
};
