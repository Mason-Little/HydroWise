import type {
  JsonValue,
  PartialJsonSnapshot,
} from "@/adapters/web/structured/types";

// Strips trailing commas and colons that would make a JSON fragment invalid.
const trimTrailingJsonSeparator = (text: string) => {
  let candidate = text.trimEnd();

  while (candidate.endsWith(",") || candidate.endsWith(":")) {
    candidate = candidate.slice(0, -1).trimEnd();
  }

  return candidate;
};

// Closes any open strings, objects, and arrays to produce the shortest valid JSON candidate.
const buildPartialCandidate = (text: string) => {
  let candidate = trimTrailingJsonSeparator(text);
  const stack: string[] = [];
  let escaping = false;
  let inString = false;

  for (const char of candidate) {
    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      stack.push("}");
      continue;
    }

    if (char === "[") {
      stack.push("]");
      continue;
    }

    if ((char === "}" || char === "]") && stack.at(-1) === char) {
      stack.pop();
    }
  }

  if (inString) {
    candidate += '"';
  }

  candidate = trimTrailingJsonSeparator(candidate);

  while (stack.length > 0) {
    candidate += stack.pop();
  }

  return candidate;
};

// Accumulates streaming text deltas and emits parseable JSON snapshots as they become available.
export class PartialJsonAccumulator {
  private readonly seenSnapshots = new Set<string>();
  private text = "";

  // Appends a delta to the accumulated text and returns a snapshot if one can be parsed.
  append(delta: string): PartialJsonSnapshot | undefined {
    this.text += delta;

    const candidate = buildPartialCandidate(this.text);
    if (!candidate) {
      return undefined;
    }

    try {
      const value = JSON.parse(candidate) as JsonValue;
      const serialized = JSON.stringify(value);
      if (this.seenSnapshots.has(serialized)) {
        return undefined;
      }

      this.seenSnapshots.add(serialized);
      const snapshot = { complete: candidate === this.text.trim(), value };
      return snapshot;
    } catch {
      return undefined;
    }
  }

  // Parses and returns the fully accumulated text as a complete JSON value.
  finalize(): JsonValue {
    return JSON.parse(this.text) as JsonValue;
  }

  // Returns the raw accumulated text without parsing.
  getText() {
    return this.text;
  }
}
