import type { Tensor } from "@huggingface/transformers";

const NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;

// Returns the number of 32-bit integers needed to store a bitmask for the given vocab size.
const getExpectedBitmaskLength = (vocabSize: number) =>
  Math.ceil(vocabSize / 32);

// Returns true if the token at the given id is marked as accepted in the bitmask.
const isAcceptedToken = (bitmask: Int32Array, tokenId: number) =>
  ((bitmask[tokenId >>> 5] >>> (tokenId & 31)) & 1) === 1;

// Iterates the bitmask and returns all token ids accepted by the grammar at this step.
export const collectAcceptedTokenIds = (
  bitmask: Int32Array,
  grammarVocabSize: number,
  logitsVocabSize: number,
) => {
  if (grammarVocabSize > logitsVocabSize) {
    throw new Error(
      `Structured grammar vocab (${grammarVocabSize}) exceeds model logits vocab (${logitsVocabSize}).`,
    );
  }

  const expectedBitmaskLength = getExpectedBitmaskLength(grammarVocabSize);
  if (bitmask.length !== expectedBitmaskLength) {
    throw new Error(
      `Structured grammar bitmask length mismatch. Expected ${expectedBitmaskLength}, received ${bitmask.length}.`,
    );
  }

  const acceptedTokenIds: number[] = [];
  for (let tokenId = 0; tokenId < grammarVocabSize; tokenId += 1) {
    if (isAcceptedToken(bitmask, tokenId)) {
      acceptedTokenIds.push(tokenId);
    }
  }

  if (acceptedTokenIds.length === 0) {
    throw new Error(
      "Structured grammar returned an empty accepted-token mask.",
    );
  }

  return acceptedTokenIds;
};

// Sets logit scores to -Infinity for every token not permitted by the grammar bitmask.
export const applyTokenBitmaskInPlace = (
  logits: Tensor,
  bitmask: Int32Array,
  grammarVocabSize: number,
) => {
  const logitsVocabSize = logits.dims.at(-1);
  if (logitsVocabSize == null) {
    throw new Error("Structured logits tensor is missing a vocab dimension.");
  }

  const rowCount = logits.data.length / logitsVocabSize;
  if (!Number.isInteger(rowCount) || rowCount !== 1) {
    throw new Error(
      `Structured output only supports batch size 1. Received ${rowCount}.`,
    );
  }

  if (grammarVocabSize > logitsVocabSize) {
    throw new Error(
      `Structured grammar vocab (${grammarVocabSize}) exceeds logits vocab (${logitsVocabSize}).`,
    );
  }

  const expectedBitmaskLength = getExpectedBitmaskLength(grammarVocabSize);
  if (bitmask.length !== expectedBitmaskLength) {
    throw new Error(
      `Structured grammar bitmask length mismatch. Expected ${expectedBitmaskLength}, received ${bitmask.length}.`,
    );
  }

  for (let tokenId = 0; tokenId < logitsVocabSize; tokenId += 1) {
    if (tokenId >= grammarVocabSize || !isAcceptedToken(bitmask, tokenId)) {
      logits.data[tokenId] = NEGATIVE_INFINITY;
    }
  }
};
