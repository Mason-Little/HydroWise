import { getLanguageModelDefinition } from "@hydrowise/ai-runtime";
import { DownloadIcon } from "lucide-react";
import { useModelStore } from "@/store/modelStore";
import { useBootstrapAllModels } from "../hooks/useBootstrapAllModels";
import { ModelDownloadBar } from "./detail/ModelDownloadBar";

const STAGE_LABELS = {
  language: "Downloading language model…",
  embedding: "Downloading embedding model…",
  vision: "Downloading vision model…",
} as const;

export const ModelBootstrapBanner = () => {
  const defaultModelTier = useModelStore((s) => s.defaultModelTier);
  const bootstrapMissingLanguage = useModelStore((s) => s.bootstrapMissingLanguage);
  const bootstrapMissingEmbedding = useModelStore((s) => s.bootstrapMissingEmbedding);
  const bootstrapMissingVision = useModelStore((s) => s.bootstrapMissingVision);

  const { bootstrapDownload, isBootstrapping, bootstrapAllModels } =
    useBootstrapAllModels();

  if (bootstrapDownload) {
    return (
      <div className="mb-3 rounded-xl border border-border bg-muted p-3">
        <p className="text-[length:var(--font-size-sm)] font-medium text-muted-2">
          {STAGE_LABELS[bootstrapDownload.stage]}
        </p>
        <ModelDownloadBar
          bytesDownloaded={bootstrapDownload.bytesDownloaded}
          bytesTotal={bootstrapDownload.bytesTotal}
        />
      </div>
    );
  }

  const languageSizeLabel = defaultModelTier
    ? getLanguageModelDefinition(defaultModelTier).sizeLabel
    : null;

  return (
    <div className="mb-3 rounded-xl border border-border bg-muted p-3">
      <p className="text-[length:var(--font-size-sm)] font-semibold text-foreground">
        First time here?
      </p>
      <p className="mt-0.5 text-[length:var(--font-size-sm)] text-muted-2">
        Download models to enable all AI features.
      </p>
      <ul className="mt-2 space-y-0.5 text-[length:var(--font-size-sm)] text-muted-2">
        {bootstrapMissingLanguage && languageSizeLabel && (
          <li>· Language model — {languageSizeLabel}</li>
        )}
        {bootstrapMissingEmbedding && <li>· Embedding model — 30 MB</li>}
        {bootstrapMissingVision && <li>· Vision model — 0.8 GB</li>}
      </ul>
      <button
        type="button"
        onClick={() => void bootstrapAllModels()}
        disabled={isBootstrapping}
        className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-transparent bg-[var(--btn-download-bg)] px-3.5 py-1.5 text-xs font-semibold text-[var(--btn-download-text)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
      >
        <DownloadIcon className="size-[var(--size-icon-sm)]" />
        Download
      </button>
    </div>
  );
};
