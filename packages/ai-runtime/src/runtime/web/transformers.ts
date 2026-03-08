import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
  RawImage,
  TextStreamer,
} from "@huggingface/transformers";

const MODEL_ID = "onnx-community/Qwen3.5-0.8B-ONNX";

type LoadProgress = {
  progress?: number;
  file?: string;
  status?: string;
  loaded?: number;
  total?: number;
};

export type WebChatRole = "system" | "user" | "assistant";

export type WebChatPart =
  | { type: "text"; text: string }
  | { type: "image"; image: string | Blob | File | URL };

export type WebChatMessage = {
  role: WebChatRole;
  content: string | WebChatPart[];
};

export type GenerateWebChatOptions = {
  messages: WebChatMessage[];
  maxNewTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  onToken?: (token: string) => void;
};

let processorPromise: Promise<any> | null = null;
let modelPromise: Promise<any> | null = null;

/** Called during download/load with progress 0–100 and optional file/status. */
function onProgress(progress: LoadProgress) {
  const pct = progress.progress ?? 0;
  const file = progress.file ?? "";
  const status = progress.status ?? "";
  const loaded =
    progress.loaded != null
      ? `${(progress.loaded / 1024 / 1024).toFixed(2)} MB`
      : "";
  const total =
    progress.total != null
      ? `${(progress.total / 1024 / 1024).toFixed(2)} MB`
      : "";

  console.log(
    `[Load] ${pct.toFixed(1)}% ${file ? `— ${file} ` : ""}${status} ${
      loaded && total ? `(${loaded} / ${total})` : ""
    }`,
  );
}

export function getWebProcessor() {
  if (!processorPromise) {
    processorPromise = AutoProcessor.from_pretrained(MODEL_ID, {
      progress_callback: onProgress,
    });
  }

  return processorPromise;
}

export function getWebModel() {
  if (!modelPromise) {
    const device =
      typeof navigator !== "undefined" && "gpu" in navigator ? "webgpu" : "cpu";
    modelPromise = Qwen3_5ForConditionalGeneration.from_pretrained(MODEL_ID, {
      progress_callback: onProgress,
      dtype: {
        embed_tokens: "q4",
        vision_encoder: "fp16",
        decoder_model_merged: "q4",
      },
      device,
    });
  }

  return modelPromise;
}

async function toRawImage(input: string | Blob | File | URL) {
  const image =
    input instanceof URL ? input.toString() : (input as string | Blob | File);
  return await (await RawImage.read(image)).resize(448, 448);
}

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
  processor: { tokenizer: { batch_decode: (batch: number[][] | any, opts?: any) => string[] } },
  outputs: any,
  promptLength: number,
) {
  // dims[1] = sequence length for standard 2D (batch, seq) tensors; fall back to last dimension for other shapes.
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

export async function generateWebChat({
  messages,
  maxNewTokens = 256,
  temperature = 0.7,
  topP = 0.8,
  topK = 20,
  onToken,
}: GenerateWebChatOptions) {
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

  // streamed accumulates tokens via callback; used as fallback if promptLength is unavailable or decoding fails.
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

  const promptLength = inputs.input_ids.dims?.at(-1) ?? inputs.input_ids.dims?.[1];
  if (promptLength == null) {
    return streamed;
  }

  return decodeGeneratedText(processor, outputs, promptLength) ?? streamed;
}

export async function warmupWebModel() {
  await Promise.all([getWebProcessor(), getWebModel()]);
}
