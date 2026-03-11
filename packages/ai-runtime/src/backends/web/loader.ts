import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
  RawImage,
} from "@huggingface/transformers";
import {
  DEFAULT_WEB_LANGUAGE_MODEL_TIER,
  getLanguageModelDefinition,
} from "../../config";

const defaultWebChatBackendPromise = (async () => {
  const definition = getLanguageModelDefinition(DEFAULT_WEB_LANGUAGE_MODEL_TIER);
  const modelId = definition.webModelId;

  if (!modelId) {
    throw new Error(
      `Model ${definition.modelId} is not available on web.`,
    );
  }

  const device =
    typeof navigator !== "undefined" && "gpu" in navigator ? "webgpu" : "cpu";

  const [processor, model] = await Promise.all([
    AutoProcessor.from_pretrained(modelId),
    Qwen3_5ForConditionalGeneration.from_pretrained(modelId, {
      dtype: {
        embed_tokens: "q4",
        vision_encoder: "fp16",
        decoder_model_merged: "q4",
      },
      device,
    }),
  ]);

  return { processor, model };
})();

export const loadDefaultWebChatBackend = () => defaultWebChatBackendPromise;

export const toRawImage = async (input: string | Blob | File | URL) => {
  const image =
    input instanceof URL ? input.toString() : (input as string | Blob | File);
  return (await RawImage.read(image)).resize(448, 448);
};
