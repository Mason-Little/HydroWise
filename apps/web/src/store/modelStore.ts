import {
  initEmbeddings,
  initLLMClient,
  initVisionModel,
} from "@hydrowise/llm-client";
import { create } from "zustand";

type modelStatus = {
  status: "cold" | "warming" | "warm";
  progress: number;
};

type modelKeys = "LLM" | "Vision" | "Embeddings";

export type inferenceStatus = Record<modelKeys, modelStatus>;

interface modelStore {
  inferenceStatus: inferenceStatus;
  setInferenceStatus: (progress: number, modelType: modelKeys) => void;
  initLLMClient: () => Promise<void>;
  initVisionModel: () => Promise<void>;
  initEmbeddings: () => Promise<void>;
  initAllEngines: () => Promise<void>;
}

export const modelStore = create<modelStore>((set, get) => ({
  inferenceStatus: {
    LLM: { status: "cold", progress: 0 },
    Vision: { status: "cold", progress: 0 },
    Embeddings: { status: "cold", progress: 0 },
  },
  setInferenceStatus: (progress: number, modelType: modelKeys) =>
    set({
      inferenceStatus: {
        ...get().inferenceStatus,
        [modelType]: {
          status: progress === 100 ? "warm" : "warming",
          progress,
        },
      },
    }),
  initLLMClient: async () => {
    if (get().inferenceStatus.LLM.status === "cold") {
      await initLLMClient((progress) => {
        get().setInferenceStatus(progress, "LLM");
      });
    }
    return Promise.resolve();
  },
  initVisionModel: async () => {
    if (get().inferenceStatus.Vision.status === "cold") {
      await initVisionModel((progress) => {
        get().setInferenceStatus(progress, "Vision");
      });
    }
    return Promise.resolve();
  },
  initEmbeddings: async () => {
    if (get().inferenceStatus.Embeddings.status === "cold") {
      await initEmbeddings((progress) => {
        get().setInferenceStatus(progress, "Embeddings");
      });
    }
    return Promise.resolve();
  },

  initAllEngines: async () => {
    await Promise.all([
      get().initLLMClient(),
      get().initVisionModel(),
      get().initEmbeddings(),
    ]);
  },
}));
