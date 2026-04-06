import type { Processor } from "@huggingface/transformers";

export const decodeGeneratedText = (
  processor: Processor,
  outputs: any,
  promptLength: number,
): string => {
  const seqLen = outputs.dims?.[1] ?? outputs.dims?.[outputs.dims?.length - 1];
  const end = seqLen != null ? seqLen : promptLength + 256;
  const sliced =
    typeof outputs.slice === "function"
      ? outputs.slice(null, [promptLength, end])
      : outputs;
  return processor.batch_decode(sliced, {
    skip_special_tokens: true,
  })[0] as string;
};
