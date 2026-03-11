import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { ModelSelect } from "@/features/ai/model-selection/ModelSelect";
import {
  DEFAULT_MODEL_ID,
  getModelDefinition,
  type LanguageModelDownloadState,
  type LanguageModelId,
  type LanguageModelLoadState,
  MODEL_OPTIONS,
} from "@/features/ai/model-selection/temp-config";
import { cn } from "@/lib/utils";

export type TempModelState = {
  downloadState: LanguageModelDownloadState;
  loadState: LanguageModelLoadState;
};

export type TempModelStateMap = Record<LanguageModelId, TempModelState>;

const buildInitialModelStates = (): TempModelStateMap => {
  const states = {} as TempModelStateMap;

  for (const model of MODEL_OPTIONS) {
    const isActive = model.id === DEFAULT_MODEL_ID;

    states[model.id] = model.web.enabled
      ? {
          downloadState: "downloaded",
          loadState: isActive ? "in-use" : "ready",
        }
      : {
          downloadState: "not-downloaded",
          loadState: "unavailable",
        };
  }

  return states;
};

export const SelectedModelPill = () => {
  const [open, setOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] =
    useState<LanguageModelId>(DEFAULT_MODEL_ID);
  const [activeModelId, setActiveModelId] =
    useState<LanguageModelId>(DEFAULT_MODEL_ID);
  const [modelStates, setModelStates] = useState(buildInitialModelStates);

  const activeModel = getModelDefinition(activeModelId);

  const handleSelectModel = (id: LanguageModelId) => {
    setSelectedModelId(id);
  };

  const handleStartDownload = (id: LanguageModelId) => {
    const model = getModelDefinition(id);

    if (!model.web.enabled) {
      return;
    }

    setModelStates((current) => ({
      ...current,
      [id]: {
        downloadState: "downloaded",
        loadState: current[id].loadState === "in-use" ? "in-use" : "ready",
      },
    }));
  };

  const handleWarmUp = (id: LanguageModelId) => {
    const model = getModelDefinition(id);
    const nextState = modelStates[id];

    if (!model.web.enabled || nextState.downloadState !== "downloaded") {
      return;
    }

    setModelStates((current) => ({
      ...current,
      [activeModelId]: {
        ...current[activeModelId],
        loadState: activeModelId === id ? "in-use" : "ready",
      },
      [id]: {
        ...current[id],
        loadState: "in-use",
      },
    }));
    setActiveModelId(id);
  };

  return (
    <ModelSelect
      open={open}
      onOpenChange={setOpen}
      selectedModelId={selectedModelId}
      activeModelId={activeModelId}
      modelStates={modelStates}
      onSelectModel={handleSelectModel}
      onStartDownload={handleStartDownload}
      onWarmUp={handleWarmUp}
    >
      <button
        type="button"
        className={cn(
          "text-foreground inline-flex h-9 items-center gap-2.5 rounded-xl border border-border px-3.5 shadow-sm transition-colors",
          open ? "bg-secondary" : "bg-card",
        )}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex size-3.5 items-center justify-center rounded-full bg-[var(--green-bg)]">
            <span className="size-2 rounded-full bg-[var(--green)]" />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {activeModel.label}
          </span>
        </span>
        <ChevronDownIcon
          className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          strokeWidth={2.25}
        />
      </button>
    </ModelSelect>
  );
};
