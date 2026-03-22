import type {
  Message,
  PreTrainedModel,
  Processor,
  Tensor,
} from "@huggingface/transformers";
import { RawImage } from "@huggingface/transformers";

type CallableProcessor = Processor &
  ((
    image: RawImage,
    text: string,
    options: { return_tensors: "pt" },
  ) => Promise<Record<string, Tensor>>);

export const runWebOcr = async (
  model: PreTrainedModel,
  processor: Processor,
  imageBlob: Blob,
): Promise<string> => {
  const image = await RawImage.fromBlob(imageBlob);

  const conversation: Message[] = [
    {
      role: "user",
      content: [{ type: "image" }],
    },
  ];

  const text = processor.apply_chat_template(conversation, {
    tokenize: false,
    add_generation_prompt: true,
  }) as string;

  const inputs = await (processor as CallableProcessor)(image, text, {
    return_tensors: "pt",
  });

  const outputIds = (await model.generate({
    ...inputs,
    max_new_tokens: 1024,
    do_sample: true,
    repetition_penalty: 1.1,
    top_p: 0.9,
    top_k: 40,
  })) as Tensor;

  const promptLen = (inputs.input_ids as Tensor).dims[1];
  const [, totalLen] = outputIds.dims;
  const newTokens = outputIds.slice([0, promptLen], [1, totalLen]);

  const [decoded] = processor.batch_decode(newTokens, {
    skip_special_tokens: true,
  });

  return decoded ?? "";
};
