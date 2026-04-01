import type { Tensor } from "@huggingface/transformers";
import { LogitsProcessor } from "@huggingface/transformers";
import { applyTokenBitmaskInPlace } from "@/adapters/web/structured/bitmask";
import type { StructuredOutputMatcher } from "@/adapters/web/structured/matcher";

// Applies grammar-constrained token masking to logits before each generation step.
export class StructuredOutputLogitsProcessor extends LogitsProcessor {
  // Stores the grammar matcher used to retrieve the allowed-token bitmask each step.
  constructor(private readonly matcher: StructuredOutputMatcher) {
    super();
  }

  // Masks all logits not permitted by the current grammar state, then returns the tensor.
  _call(_inputIds: bigint[][], logits: Tensor) {
    const logitsVocabSize = logits.dims.at(-1);
    if (logitsVocabSize == null) {
      throw new Error("Structured logits tensor is missing a vocab dimension.");
    }

    const preparedMask = this.matcher.consumePreparedBitmask(logitsVocabSize);
    applyTokenBitmaskInPlace(
      logits,
      preparedMask.bitmask,
      preparedMask.grammarVocabSize,
    );
    return logits;
  }
}
