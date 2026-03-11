import {
  getDefaultLanguageModelId,
  getLanguageModelDefinition,
  LANGUAGE_MODELS,
  type LanguageModelDownloadState,
  type LanguageModelId,
  type LanguageModelLoadState,
} from "@hydrowise/ai-runtime";
import { create } from "zustand";
import { MODEL_UI_META } from "@/features/ai/model-selection/modelUiMeta";
import {
  clearDownloadInterval,
  clearWarmupTimeout,
  resetWarmupTimeout,
  setDownloadInterval,
  setWarmupTimeout,
} from "./modelSelectorSimulation";

export interface PerModelState {
  downloadState: LanguageModelDownloadState;
  loadState: LanguageModelLoadState;
  bytesDownloaded: number | null;
  bytesTotal: number | null;
}

const DEFAULT_MODEL_ID = getDefaultLanguageModelId("web");

const getDownloadSizeBytes = (id: LanguageModelId) =>
  MODEL_UI_META[id].sizeBytes;

const getWebModelDefinition = (id: LanguageModelId) => {
  const model = getLanguageModelDefinition(id);
  return model.web.enabled ? model : null;
};

const getWarmingModelId = (
  modelStates: Record<LanguageModelId, PerModelState>,
) =>
  Object.entries(modelStates).find(
    ([, state]) => state.loadState === "warming",
  )?.[0] as LanguageModelId | undefined;

const buildInitialModelStates = (): Record<LanguageModelId, PerModelState> => {
  const record = {} as Record<LanguageModelId, PerModelState>;
  const activeModelId = DEFAULT_MODEL_ID;
  for (const model of LANGUAGE_MODELS) {
    const webEnabled = model.web.enabled;
    const bytesTotal = getDownloadSizeBytes(model.id);
    const isActive = model.id === activeModelId;
    record[model.id] = {
      downloadState: webEnabled ? "downloaded" : "not-downloaded",
      loadState: webEnabled ? (isActive ? "in-use" : "ready") : "unavailable",
      bytesDownloaded: webEnabled ? bytesTotal : null,
      bytesTotal: webEnabled ? bytesTotal : null,
    };
  }
  return record;
};

const DOWNLOAD_DURATION_MS = 3000;
const DOWNLOAD_TICK_MS = 150;
const WARMUP_DURATION_MS = 2000;

interface ModelSelectorStore {
  selectedModelId: LanguageModelId;
  activeModelId: LanguageModelId;
  modelStates: Record<LanguageModelId, PerModelState>;
  selectModel: (id: LanguageModelId) => void;
  startDownload: (id: LanguageModelId) => void;
  cancelDownload: (id: LanguageModelId) => void;
  warmUp: (id: LanguageModelId) => void;
  setBytes: (
    id: LanguageModelId,
    bytesDownloaded: number,
    bytesTotal: number,
  ) => void;
}

export const useModelSelectorStore = create<ModelSelectorStore>((set, get) => ({
  selectedModelId: DEFAULT_MODEL_ID,
  activeModelId: DEFAULT_MODEL_ID,
  modelStates: buildInitialModelStates(),

  selectModel: (id) => set({ selectedModelId: id }),

  startDownload: (id) => {
    if (!getWebModelDefinition(id)) {
      return;
    }

    const state = get().modelStates[id];
    if (state?.downloadState !== "not-downloaded") {
      return;
    }

    const bytesTotal = getDownloadSizeBytes(id);

    set((prev) => ({
      modelStates: {
        ...prev.modelStates,
        [id]: {
          ...prev.modelStates[id],
          downloadState: "downloading",
          loadState: "idle",
          bytesDownloaded: 0,
          bytesTotal,
        },
      },
    }));

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += DOWNLOAD_TICK_MS;
      const progress = Math.min(100, (elapsed / DOWNLOAD_DURATION_MS) * 100);
      const bytesDownloaded = Math.round((progress / 100) * bytesTotal);
      get().setBytes(id, bytesDownloaded, bytesTotal);

      if (progress >= 100) {
        clearDownloadInterval(id);
        set((prev) => ({
          modelStates: {
            ...prev.modelStates,
            [id]: {
              ...prev.modelStates[id],
              downloadState: "downloaded",
              loadState: "ready",
              bytesDownloaded: bytesTotal,
              bytesTotal,
            },
          },
        }));
      }
    }, DOWNLOAD_TICK_MS);
    setDownloadInterval(id, interval);
  },

  cancelDownload: (id) => {
    if (!getWebModelDefinition(id)) {
      return;
    }

    const state = get().modelStates[id];
    if (state?.downloadState !== "downloading") {
      return;
    }

    clearDownloadInterval(id);

    set((prev) => ({
      modelStates: {
        ...prev.modelStates,
        [id]: {
          ...prev.modelStates[id],
          downloadState: "not-downloaded",
          loadState: "idle",
          bytesDownloaded: null,
          bytesTotal: null,
        },
      },
    }));
  },

  warmUp: (id) => {
    if (!getWebModelDefinition(id)) {
      return;
    }

    const { activeModelId, modelStates } = get();
    const state = modelStates[id];
    if (state?.loadState !== "ready" || state?.downloadState !== "downloaded") {
      return;
    }

    const warmingModelId = getWarmingModelId(modelStates);
    clearWarmupTimeout();

    set((prev) => {
      const nextModelStates = {
        ...prev.modelStates,
        [id]: { ...prev.modelStates[id], loadState: "warming" as const },
      };
      if (warmingModelId) {
        nextModelStates[warmingModelId] = {
          ...prev.modelStates[warmingModelId],
          loadState: "ready" as const,
        };
      }
      return { modelStates: nextModelStates };
    });

    setWarmupTimeout(
      setTimeout(() => {
        resetWarmupTimeout();
        set((prev) => ({
          modelStates: {
            ...prev.modelStates,
            [activeModelId]: {
              ...prev.modelStates[activeModelId],
              loadState: "ready",
            },
            [id]: {
              ...prev.modelStates[id],
              loadState: "in-use",
            },
          },
          activeModelId: id,
        }));
      }, WARMUP_DURATION_MS),
    );
  },

  setBytes: (id, bytesDownloaded, bytesTotal) => {
    if (!getWebModelDefinition(id)) {
      return;
    }

    const state = get().modelStates[id];
    if (state?.downloadState !== "downloading") {
      return;
    }

    set((prev) => ({
      modelStates: {
        ...prev.modelStates,
        [id]: {
          ...prev.modelStates[id],
          bytesDownloaded,
          bytesTotal,
        },
      },
    }));
  },
}));
