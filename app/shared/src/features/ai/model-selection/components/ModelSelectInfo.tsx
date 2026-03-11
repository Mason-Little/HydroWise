import type { TempModelState } from "../SelectedModelPill";
import {
  getModelDefinition,
  type LanguageModelDownloadState,
  type LanguageModelId,
} from "../temp-config";
import {
  ModelActionButton,
  type ModelActionVariant,
} from "./detail/ModelActionButton";
import { ModelDesktopNotice } from "./detail/ModelDesktopNotice";
import { ModelStatusTag } from "./detail/ModelStatusTag";

const getActionVariant = (
  downloadState: LanguageModelDownloadState,
  loadState: TempModelState["loadState"],
  desktopOnly: boolean,
  isActive: boolean,
): ModelActionVariant => {
  if (desktopOnly) return "locked";
  if (downloadState === "not-downloaded") return "download";
  if (loadState === "in-use" && isActive) return "active";
  return "warmup";
};

type ModelInfoViewState = {
  actionVariant: ModelActionVariant;
  desktopOnly: boolean;
  isActive: boolean;
};

const getModelInfoViewState = ({
  activeModelId,
  downloadState,
  loadState,
  selectedModelId,
  webEnabled,
}: {
  activeModelId: LanguageModelId;
  downloadState: LanguageModelDownloadState;
  loadState: TempModelState["loadState"];
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
  };
};

type ModelSelectInfoProps = {
  selectedModelId: LanguageModelId;
  activeModelId: LanguageModelId;
  modelState: TempModelState;
  onStartDownload: (id: LanguageModelId) => void;
  onWarmUp: (id: LanguageModelId) => void;
};

export const ModelSelectInfo = ({
  selectedModelId,
  activeModelId,
  modelState,
  onStartDownload,
  onWarmUp,
}: ModelSelectInfoProps) => {
  const model = getModelDefinition(selectedModelId);
  const { downloadState, loadState } = modelState;

  const { actionVariant, desktopOnly, isActive } = getModelInfoViewState({
    activeModelId,
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
      onStartDownload(selectedModelId);
      return;
    }

    if (loadState === "ready") {
      onWarmUp(selectedModelId);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {model.label}
          </span>
          <span className="text-xs text-muted-2">{model.sizeLabel}</span>
          <ModelStatusTag
            downloadState={downloadState}
            loadState={loadState}
            desktopOnly={desktopOnly}
          />
        </div>

        <ModelActionButton variant={actionVariant} onClick={handleAction} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {model.description}
      </p>

      {desktopOnly ? <ModelDesktopNotice /> : null}
    </div>
  );
};
