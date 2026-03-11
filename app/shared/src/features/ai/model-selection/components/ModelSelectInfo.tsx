import {
  getLanguageModelDefinition,
  type LanguageModelDownloadState,
  type LanguageModelId,
  type LanguageModelLoadState,
} from "@hydrowise/ai-runtime";
import { useShallow } from "zustand/react/shallow";
import { MODEL_UI_META } from "@/features/ai/model-selection/modelUiMeta";
import { useModelSelectorStore } from "@/store/modelSelectorStore";
import {
  ModelActionButton,
  type ModelActionVariant,
} from "./detail/ModelActionButton";
import { ModelDesktopNotice } from "./detail/ModelDesktopNotice";
import { ModelDownloadBar } from "./detail/ModelDownloadBar";
import { ModelStatusTag } from "./detail/ModelStatusTag";
import { ModelWarmingIndicator } from "./detail/ModelWarmingIndicator";

const getActionVariant = (
  downloadState: LanguageModelDownloadState,
  loadState: LanguageModelLoadState,
  desktopOnly: boolean,
  isActive: boolean,
): ModelActionVariant => {
  if (desktopOnly) return "locked";
  if (downloadState === "not-downloaded") return "download";
  if (downloadState === "downloading") return "progress";
  if (loadState === "warming") return "warming";
  if (loadState === "in-use" && isActive) return "active";
  return "warmup";
};

type ModelInfoViewState = {
  actionVariant: ModelActionVariant;
  desktopOnly: boolean;
  isActive: boolean;
  progressPercent: number;
};

const getModelInfoViewState = ({
  activeModelId,
  bytesDownloaded,
  bytesTotal,
  downloadState,
  loadState,
  selectedModelId,
  webEnabled,
}: {
  activeModelId: LanguageModelId;
  bytesDownloaded: number | null;
  bytesTotal: number | null;
  downloadState: LanguageModelDownloadState;
  loadState: LanguageModelLoadState;
  selectedModelId: LanguageModelId;
  webEnabled: boolean;
}): ModelInfoViewState => {
  const isActive = activeModelId === selectedModelId;
  const desktopOnly = !webEnabled;
  const actionVariant = getActionVariant(
    downloadState,
    loadState,
    desktopOnly,
    isActive,
  );

  return {
    actionVariant,
    desktopOnly,
    isActive,
    progressPercent:
      actionVariant === "progress" &&
      bytesDownloaded !== null &&
      bytesTotal !== null
        ? Math.round((bytesDownloaded / bytesTotal) * 100)
        : 0,
  };
};

export const ModelSelectInfo = () => {
  const {
    selectedModelId,
    activeModelId,
    modelStates,
    startDownload,
    cancelDownload,
    warmUp,
  } = useModelSelectorStore(
    useShallow((s) => ({
      selectedModelId: s.selectedModelId,
      activeModelId: s.activeModelId,
      modelStates: s.modelStates,
      startDownload: s.startDownload,
      cancelDownload: s.cancelDownload,
      warmUp: s.warmUp,
    })),
  );

  const model = getLanguageModelDefinition(selectedModelId);
  const selectedState = modelStates[selectedModelId];
  const activeModel = getLanguageModelDefinition(activeModelId);

  const { downloadState, loadState, bytesDownloaded, bytesTotal } =
    selectedState;

  const { actionVariant, desktopOnly, isActive, progressPercent } =
    getModelInfoViewState({
      activeModelId,
      bytesDownloaded,
      bytesTotal,
      downloadState,
      loadState,
      selectedModelId,
      webEnabled: model.web.enabled,
    });

  const handleAction = () => {
    if (desktopOnly || isActive) {
      return;
    }

    if (downloadState === "not-downloaded") {
      startDownload(selectedModelId);
      return;
    }

    if (downloadState === "downloading") {
      cancelDownload(selectedModelId);
      return;
    }

    if (loadState === "ready") {
      warmUp(selectedModelId);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {model.label}
          </span>
          <span className="text-xs text-muted-2">
            {MODEL_UI_META[selectedModelId].sizeLabel}
          </span>
          <ModelStatusTag
            downloadState={downloadState}
            loadState={loadState}
            desktopOnly={desktopOnly}
          />
        </div>

        <ModelActionButton
          variant={actionVariant}
          progressPercent={progressPercent}
          onClick={handleAction}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {model.description}
      </p>

      {downloadState === "downloading" &&
      bytesDownloaded !== null &&
      bytesTotal !== null ? (
        <ModelDownloadBar
          bytesDownloaded={bytesDownloaded}
          bytesTotal={bytesTotal}
        />
      ) : null}

      {loadState === "warming" ? (
        <ModelWarmingIndicator activeModelLabel={activeModel.label} />
      ) : null}

      {desktopOnly ? <ModelDesktopNotice /> : null}
    </div>
  );
};
