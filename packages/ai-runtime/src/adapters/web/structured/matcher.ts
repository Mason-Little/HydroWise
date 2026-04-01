import { collectAcceptedTokenIds } from "@/adapters/web/structured/bitmask";
import type { PreparedTokenMask, XGrammarMatcherHandle } from "@/adapters/web/structured/types";

// Manages the XGrammar state machine, pre-fetching the next bitmask after each accepted token.
export class StructuredOutputMatcher {
  private currentBitmask: Int32Array | undefined;
  private currentBitmaskError: Error | undefined;
  private generatedTokenIds: number[] = [];
  private pendingBitmask: Promise<void> | undefined;
  private terminated = false;

  // Stores the vocab size and matcher handle used to drive the grammar state machine.
  constructor(
    private readonly grammarVocabSize: number,
    private readonly handle: XGrammarMatcherHandle,
  ) {}

  // Fetches the initial bitmask so the first logits call is ready to proceed.
  async prime() {
    await this.prepareNextBitmask();
  }

  // Returns the pre-fetched token mask and accepted token ids for the current generation step.
  consumePreparedBitmask(logitsVocabSize: number): PreparedTokenMask {
    if (this.currentBitmaskError) {
      throw this.currentBitmaskError;
    }

    if (!this.currentBitmask) {
      throw new Error(
        "Structured grammar bitmask was not ready when logits processing started.",
      );
    }

    const bitmask = this.currentBitmask;
    this.currentBitmask = undefined;
    const acceptedTokenIds = collectAcceptedTokenIds(
      bitmask,
      this.grammarVocabSize,
      logitsVocabSize,
    );

    if (acceptedTokenIds.length === 0) {
      const generatedPreview = this.generatedTokenIds.slice(-8).join(", ");
      throw new Error(
        `Structured grammar produced no valid next tokens. Recent generated token ids: ${generatedPreview || "<none>"}.`,
      );
    }

    return {
      acceptedTokenIds,
      bitmask,
      grammarVocabSize: this.grammarVocabSize,
    };
  }

  // Feeds the generated tokens into the grammar matcher and kicks off the next bitmask fetch.
  acceptGeneratedTokens(tokenIds: readonly bigint[]) {
    for (const tokenId of tokenIds) {
      const numericTokenId = Number(tokenId);
      if (!Number.isSafeInteger(numericTokenId)) {
        throw new Error(
          `Structured grammar received a non-safe token id: ${String(tokenId)}.`,
        );
      }

      const accepted = this.handle.acceptToken(numericTokenId);
      if (!accepted) {
        throw new Error(
          `Structured grammar rejected generated token id ${numericTokenId}.`,
        );
      }

      this.generatedTokenIds.push(numericTokenId);
      this.terminated = this.handle.isTerminated();
    }

    if (!this.terminated) {
      void this.prepareNextBitmask();
    }
  }

  // Returns true once the grammar has reached a valid terminal state.
  isTerminated() {
    return this.terminated;
  }

  // Releases the underlying grammar matcher handle.
  dispose() {
    this.handle.dispose();
  }

  // Asynchronously fetches the next allowed-token bitmask from the grammar matcher.
  private async prepareNextBitmask() {
    if (this.pendingBitmask) {
      await this.pendingBitmask;
      return;
    }

    this.pendingBitmask = this.handle
      .getNextTokenBitmask()
      .then((bitmask) => {
        this.currentBitmask = bitmask;
        this.currentBitmaskError = undefined;
      })
      .catch((error: unknown) => {
        this.currentBitmask = undefined;
        this.currentBitmaskError =
          error instanceof Error
            ? error
            : new Error(String(error ?? "Unknown structured grammar error."));
      })
      .finally(() => {
        this.pendingBitmask = undefined;
      });

    await this.pendingBitmask;
  }
}
