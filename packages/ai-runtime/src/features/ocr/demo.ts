import {
  AutoModel,
  AutoProcessor,
  type DeviceType,
  type Message,
  type PreTrainedModel,
  type Processor,
  RawImage,
  type Tensor,
} from "@huggingface/transformers";

const MODEL_ID = "onnx-community/LightOnOCR-2-1B-ONNX";
const SAMPLE_IMAGE_URL =
  "https://datasets-server.huggingface.co/assets/Voxel51/scanned-images-dataset-for-ocr-and-vlm-finetuning/--/3f5ac6f2185ee1e8b5451c264602dd071c0272c4/--/default/train/16/image/image.jpg?Expires=1774156407&Signature=xgzpZSoFpGMe1KkHRX9sla7JlFNSaYhweScg44utUMlcmf4pvWEMGJ3pmoxjqLpkMXAiImmCDNvKs1TkoI2BuMgHrWibMDYaL9iMj9NhY6mC~iqVAUR1uLIk921dgsupfl9s9AcoK1b4wox3ZYc7MnWIJNbWWGhRFdg2LjTQ4IRuZVabcmu33LY2dxKSB6Hz-iyY2DTZquH4UKgDc8PSWwtGrEvNupdU-DbIaOP3gEA3I7mtgvTkBQJTxaD~dc6l2s0Bh~Bck5sfY6i1c13nQQDs2~P6hzg7uTkk2ShGOVo3c5tKxelSZZXBm8L4SAuCiJjbl7ne2n5yJ9Fu3isobA__&Key-Pair-Id=K3EI6M078Z3AC3";

// Change this to compare devices: "webgpu" | "cuda" | "coreml" | "cpu" | "wasm"
const DEVICE: DeviceType = "webgpu";

type CallableProcessor = Processor &
  ((
    image: RawImage,
    text: string,
    options: { return_tensors: "pt" },
  ) => Promise<Record<string, Tensor>>);

function elapsedMs(start: number) {
  return Math.round(performance.now() - start);
}

async function run() {
  const wallStart = performance.now();

  console.log(`Loading processor and model (device: ${DEVICE})...`);
  const loadStart = performance.now();
  const [processor, model] = await Promise.all([
    AutoProcessor.from_pretrained(MODEL_ID),
    AutoModel.from_pretrained(MODEL_ID, {
      dtype: {
        embed_tokens: "q4",
        vision_encoder: "q4",
        decoder_model_merged: "q4",
      },
      device: DEVICE,
    }),
  ]);
  const loadMs = elapsedMs(loadStart);

  console.log("Fetching sample image...");
  const fetchStart = performance.now();
  const response = await fetch(SAMPLE_IMAGE_URL);
  const imageBlob = await response.blob();
  const fetchMs = elapsedMs(fetchStart);

  // --- Phase 1: image decode ---
  console.log("Decoding image...");
  const decodeStart = performance.now();
  const image = await RawImage.fromBlob(imageBlob);
  const decodeMs = elapsedMs(decodeStart);
  console.log(`  original size: ${image.width}x${image.height}`);

  const MAX_WIDTH = 512;
  const resized =
    image.width > MAX_WIDTH
      ? await image.resize(
          MAX_WIDTH,
          Math.round(MAX_WIDTH * (image.height / image.width)),
        )
      : image;
  console.log(`  resized to: ${resized.width}x${resized.height}`);

  // --- Phase 2: preprocessing / vision encoder ---
  console.log("Preprocessing (vision encoder)...");
  const preprocStart = performance.now();
  const conversation: Message[] = [
    { role: "user", content: [{ type: "image" }] },
  ];
  const text = processor.apply_chat_template(conversation, {
    tokenize: false,
    add_generation_prompt: true,
  }) as string;
  const inputs = await (processor as CallableProcessor)(resized, text, {
    return_tensors: "pt",
  });
  const preprocMs = elapsedMs(preprocStart);
  const promptTokens = (inputs.input_ids as Tensor).dims[1];
  console.log(`  prompt tokens: ${promptTokens}`);

  // --- Phase 3: autoregressive generation ---
  console.log("Generating (autoregressive decode)...");
  const generateStart = performance.now();
  const outputIds = (await (model as PreTrainedModel).generate({
    ...inputs,
    max_new_tokens: 1024,
    do_sample: true,
    repetition_penalty: 1.1,
    top_p: 0.9,
    top_k: 40,
  })) as Tensor;
  const generateMs = elapsedMs(generateStart);

  const [, totalLen] = outputIds.dims;
  const newTokenCount = totalLen - promptTokens;
  const tokensPerSecond = (newTokenCount / generateMs) * 1000;

  // --- Phase 4: decode tokens ---
  const batchDecodeStart = performance.now();
  const newTokens = outputIds.slice([0, promptTokens], [1, totalLen]);
  const [decoded] = processor.batch_decode(newTokens, {
    skip_special_tokens: true,
  });
  const batchDecodeMs = elapsedMs(batchDecodeStart);

  console.log("\n--- OCR Result ---");
  console.log(decoded ?? "");

  const totalMs = elapsedMs(wallStart);
  console.log("\n--- Timings ---");
  console.log({
    device: DEVICE,
    loadModelMs: loadMs,
    fetchImageMs: fetchMs,
    imageDecodeMs: decodeMs,
    visionEncoderMs: preprocMs,
    generateMs,
    batchDecodeMs,
    totalMs,
  });

  console.log("\n--- Token Stats ---");
  console.log({
    promptTokens,
    newTokens: newTokenCount,
    tokensPerSec: Math.round(tokensPerSecond),
  });
}

run().catch(console.error);
