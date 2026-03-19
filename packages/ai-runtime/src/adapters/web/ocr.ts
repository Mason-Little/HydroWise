import type { PreTrainedModel, Processor, Tensor } from "@huggingface/transformers";
import { RawImage } from "@huggingface/transformers";

// Runs OCR inference on a base64-encoded PNG image using the loaded ONNX vision model.
// Returns the decoded text output.
export const runWebOcr = async (
  model: PreTrainedModel,
  processor: Processor,
  imageBase64: string,
): Promise<string> => {
  const image = await RawImage.fromURL(`data:image/png;base64,${imageBase64}`);

  const inputs = await processor(image);
  const outputIds = await model.generate(inputs);
  const [text] = processor.batch_decode(outputIds as Tensor, {
    skip_special_tokens: true,
  });

  return text ?? "";
};
