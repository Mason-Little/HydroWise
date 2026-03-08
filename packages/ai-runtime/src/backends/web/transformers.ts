import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
  RawImage,
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

let processorPromise: Promise<any> | null = null;
let modelPromise: Promise<any> | null = null;

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
    `[Load] ${pct.toFixed(1)}% ${file ? `- ${file} ` : ""}${status} ${
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

export async function toRawImage(input: string | Blob | File | URL) {
  const image =
    input instanceof URL ? input.toString() : (input as string | Blob | File);
  return (await RawImage.read(image)).resize(448, 448);
}

export async function warmupTransformersModel() {
  await Promise.all([getWebProcessor(), getWebModel()]);
}
