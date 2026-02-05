import type { Tensor } from "@huggingface/transformers";
import { RawImage } from "@huggingface/transformers";
import { getWebVisionModel, getWebVisionProcessor } from "../init/image";

export async function processWebImage(input: File): Promise<string> {
  const model = getWebVisionModel();
  const processor = getWebVisionProcessor();

  const image = await RawImage.fromBlob(input);

  const inputs = await processor(image, "<OCR>");

  const sequences = (await model.generate({
    ...inputs,
    max_new_tokens: 1536,
    do_sample: false,
  })) as Tensor;

  const generatedText = processor.batch_decode(sequences, {
    skip_special_tokens: false,
  })[0];

  return generatedText;
}
