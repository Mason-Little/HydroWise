import type { LanguageModelTier } from "@hydrowise/ai-runtime";
import { useModelStore } from "@/store/modelStore";
import { useModelTierStatus } from "../hooks/useModelTierStatus";
import { ModelActionButton } from "./detail/ModelActionButton";
import { ModelDesktopNotice } from "./detail/ModelDesktopNotice";
import { ModelDownloadBar } from "./detail/ModelDownloadBar";
import { ModelStatusTag } from "./detail/ModelStatusTag";

export const ModelSelectInfo = () => {
  const selectedModelTier = useModelStore((s) => s.selectedModelTier);
  if (!selectedModelTier) return null;
  return <ModelSelectInfoPanel tier={selectedModelTier} />;
};

const ModelSelectInfoPanel = ({ tier }: { tier: LanguageModelTier }) => {
  const status = useModelTierStatus(tier);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{tier}</span>
          <span className="text-xs text-muted-2">{status.sizeLabel}</span>
          <ModelStatusTag
            isActive={status.isActive}
            isDownloading={status.isDownloading}
            isCached={status.isCached}
            desktopOnly={status.desktopOnly}
          />
        </div>

        <ModelActionButton
          variant={status.actionVariant}
          onClick={status.onAction}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {status.description}
      </p>

      {status.isDownloading && (
        <ModelDownloadBar
          bytesDownloaded={status.downloadBytesDownloaded}
          bytesTotal={status.downloadBytesTotal}
        />
      )}

      {status.desktopOnly ? <ModelDesktopNotice /> : null}
    </div>
  );
};
