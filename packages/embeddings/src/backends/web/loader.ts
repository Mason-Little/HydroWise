import { pipeline } from "@huggingface/transformers";
import { WEB_EMBEDDING_MODEL_ID } from "@/config/definitions";

export const loadWebEmbeddingModel = () =>
  pipeline("feature-extraction", WEB_EMBEDDING_MODEL_ID, {
    device: "webgpu",
    dtype: "q4",
  });
