import type { EmbeddingModelV2 } from "@ai-sdk/provider";
import { loadWebEmbeddingModel } from "@/backends/web/loader";
import { WEB_EMBEDDING_MODEL_ID } from "@/config/definitions";

type WebEmbeddingPipeline = Awaited<ReturnType<typeof loadWebEmbeddingModel>>;

const webEmbeddingState: {
  activePipeline: WebEmbeddingPipeline | undefined;
  pendingPipeline: Promise<WebEmbeddingPipeline> | undefined;
} = {
  activePipeline: undefined,
  pendingPipeline: undefined,
};

const readEmbeddingRows = (output: unknown): number[][] => {
  const maybeTensor = output as { tolist?: () => unknown };
  const rows = maybeTensor.tolist?.();

  if (!rows) {
    throw new Error("Web embedding output could not be converted to arrays.");
  }

  if (Array.isArray(rows) && Array.isArray(rows[0])) {
    return rows as number[][];
  }

  if (Array.isArray(rows) && typeof rows[0] === "number") {
    return [rows as number[]];
  }

  throw new Error("Web embedding output shape is not supported.");
};

const getWebEmbeddingPipeline = async (): Promise<WebEmbeddingPipeline> => {
  if (webEmbeddingState.activePipeline) {
    return webEmbeddingState.activePipeline;
  }

  if (!webEmbeddingState.pendingPipeline) {
    webEmbeddingState.pendingPipeline = loadWebEmbeddingModel().then((pipeline) => {
      webEmbeddingState.activePipeline = pipeline;
      return pipeline;
    });
  }

  return webEmbeddingState.pendingPipeline;
};

export const createWebEmbeddingModel = (): EmbeddingModelV2<string> => ({
  specificationVersion: "v2",
  provider: "hydrowise-web-embeddings",
  modelId: WEB_EMBEDDING_MODEL_ID,
  maxEmbeddingsPerCall: undefined,
  supportsParallelCalls: true,
  async doEmbed(options) {
    const pipeline = await getWebEmbeddingPipeline();
    const output = await pipeline(options.values, {
      pooling: "mean",
      normalize: true,
    });

    return {
      embeddings: readEmbeddingRows(output),
    };
  },
});
