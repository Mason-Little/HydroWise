import { TextStreamer } from "@huggingface/transformers";
import {
  getWebModel,
  getWebProcessor,
  toRawImage,
  type WebChatMessage,
  type WebChatPart,
  warmupTransformersModel,
} from "./transformers";

export type { WebChatMessage, WebChatPart };

export type GenerateWebChatOptions = {
  messages: WebChatMessage[];
  maxNewTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  onToken?: (token: string) => void;
};

function normalizeConversation(messages: WebChatMessage[]) {
  return messages.map((message) => {
    if (typeof message.content === "string") {
      return {
        role: message.role,
        content: [{ type: "text", text: message.content }],
      };
    }

    return {
      role: message.role,
      content: message.content.map((part) => {
        if (part.type === "text") {
          return { type: "text", text: part.text };
        }

        return { type: "image" };
      }),
    };
  });
}

async function extractImages(messages: WebChatMessage[]) {
  const promises: ReturnType<typeof toRawImage>[] = [];

  for (const message of messages) {
    if (typeof message.content === "string") continue;

    for (const part of message.content) {
      if (part.type === "image") {
        promises.push(toRawImage(part.image));
      }
    }
  }

  return Promise.all(promises);
}

function decodeGeneratedText(
  processor: {
    tokenizer: {
      batch_decode: (batch: number[][] | any, opts?: any) => string[];
    };
  },
  outputs: any,
  promptLength: number,
) {
  const seqLen = outputs.dims?.[1] ?? outputs.dims?.[outputs.dims?.length - 1];
  const end = seqLen != null ? seqLen : promptLength + 256;
  const sliced =
    typeof outputs.slice === "function"
      ? outputs.slice(null, [promptLength, end])
      : outputs;
  return processor.tokenizer.batch_decode(sliced, {
    skip_special_tokens: true,
  })[0] as string;
}

export async function generateWebChat(options: GenerateWebChatOptions) {
  const {
    messages,
    maxNewTokens = 256,
    temperature = 0.7,
    topP = 0.8,
    topK = 20,
    onToken,
  } = options;

  const [processor, model] = await Promise.all([
    getWebProcessor(),
    getWebModel(),
  ]);

  const conversation = normalizeConversation(messages);
  const images = await extractImages(messages);

  const text = processor.apply_chat_template(conversation, {
    add_generation_prompt: true,
  });

  const inputs =
    images.length > 0 ? await processor(text, images) : await processor(text);

  let streamed = "";
  const streamer = new TextStreamer(processor.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (chunk: string) => {
      streamed += chunk;
      onToken?.(chunk);
    },
  });

  const outputs = await model.generate({
    ...inputs,
    max_new_tokens: maxNewTokens,
    temperature,
    top_p: topP,
    top_k: topK,
    streamer,
  });

  const promptLength =
    inputs.input_ids.dims?.at(-1) ?? inputs.input_ids.dims?.[1];
  if (promptLength == null) {
    return streamed;
  }

  return decodeGeneratedText(processor, outputs, promptLength) ?? streamed;
}

export async function warmupWebBackend() {
  await warmupTransformersModel();
}
