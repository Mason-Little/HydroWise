/**
 * Standalone OCR demo — full model lifecycle (load → infer → dispose).
 *
 * Usage:
 *   bun run packages/ai-runtime/src/features/ocr/demo.ts <image-path-or-url> [prompt]
 *
 * Examples:
 *   bun run ... demo.ts ./scan.png
 *   bun run ... demo.ts https://example.com/doc.jpg "Extract only the dollar amounts."
 */

import {
  AutoModel,
  AutoProcessor,
  type ProgressInfo,
  RawImage,
} from "@huggingface/transformers";
import { getVisionModelDefinition } from "@/config/queries";

const { web } = getVisionModelDefinition();

const MODEL_ID = web.modelId;

const MODEL_DTYPE = {
  embed_tokens: "q4",
  vision_encoder: "fp16",
  decoder_model_merged: "q4",
} as const;

// ── Progress ─────────────────────────────────────────────────────────────────

function onProgress(info: ProgressInfo) {
  if (info.status === "progress" && "progress" in info && "file" in info) {
    const pct = String(
      (info as { progress: number }).progress.toFixed(1),
    ).padStart(5);
    process.stdout.write(
      `\r  [${pct}%] ${(info as { file: string }).file}              `,
    );
  } else if (info.status === "done" && "file" in info) {
    console.log(`\r  [ done] ${(info as { file: string }).file}              `);
  }
}

// ── Lifecycle: load ──────────────────────────────────────────────────────────

async function loadModel() {
  console.log("Loading processor…");
  const processor = await AutoProcessor.from_pretrained(MODEL_ID, {
    progress_callback: onProgress,
  });
  console.log();

  console.log("Loading model…");
  const model = await AutoModel.from_pretrained(MODEL_ID, {
    dtype: MODEL_DTYPE,
    device: "auto",
    progress_callback: onProgress,
  });
  console.log();

  return { processor, model };
}

// ── Lifecycle: infer ─────────────────────────────────────────────────────────

async function runOcr(
  processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>>,
  model: Awaited<ReturnType<typeof AutoModel.from_pretrained>>,
  imageSrc: string,
  prompt: string,
): Promise<string> {
  console.log(`Loading image: ${imageSrc}`);
  const image = await RawImage.fromURL(imageSrc);

  const messages = [
    {
      role: "user",
      content: [{ type: "image" }, { type: "text", text: prompt }],
    },
  ];

  // Apply the model's built-in chat template so the prompt is formatted correctly
  // for the LLaVA-family instruction format LightOnOCR uses.
  const text: string = (processor as any).apply_chat_template(messages, {
    tokenize: false,
    add_generation_prompt: true,
  });

  console.log("Preprocessing…");
  const inputs = await (processor as any)(text, image, {
    return_tensors: "pt",
  });

  console.log("Generating…");
  const t0 = performance.now();

  const outputIds = await (model as any).generate({
    ...inputs,
    max_new_tokens: 1024,
    do_sample: false,
  });

  const elapsedMs = performance.now() - t0;

  // Slice prompt tokens off so we decode only the new output
  const promptLen = (inputs.input_ids as { dims: number[] }).dims[1];
  const newTokens = outputIds.slice(null, [promptLen, null]);

  const [result]: string[] = (processor as any).batch_decode(newTokens, {
    skip_special_tokens: true,
  });

  console.log(`Done in ${(elapsedMs / 1000).toFixed(2)}s\n`);
  return result;
}

// ── Lifecycle: dispose ───────────────────────────────────────────────────────

async function disposeModel(
  model: Awaited<ReturnType<typeof AutoModel.from_pretrained>>,
) {
  if (typeof (model as any).dispose === "function") {
    await (model as any).dispose();
  }
  console.log("Model disposed.");
}

// ── Entry point ───────────────────────────────────────────────────────────────

const [, , imageArg, customPrompt] = process.argv;
const imageSrc = imageArg ?? "/Users/mason/Downloads/text_ex1.png";
const prompt =
  customPrompt ?? "Read all text in this image exactly as it appears.";

console.log(`\nLightOnOCR Demo\nModel : ${MODEL_ID}\nPrompt: ${prompt}\n`);

const { processor, model } = await loadModel();

const result = await runOcr(processor, model, imageSrc, prompt);

console.log("Result:\n");
console.log(result);
console.log();

await disposeModel(model);
