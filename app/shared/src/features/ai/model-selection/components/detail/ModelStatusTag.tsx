import type {
  LanguageModelDownloadState,
  LanguageModelLoadState,
} from "../../temp-config";

type Props = {
  downloadState: LanguageModelDownloadState;
  loadState: LanguageModelLoadState;
  desktopOnly: boolean;
};

const getTag = (
  downloadState: LanguageModelDownloadState,
  loadState: LanguageModelLoadState,
  desktopOnly: boolean,
): { text: string; className: string } | null => {
  if (loadState === "in-use") {
    return {
      text: "loaded",
      className: "bg-[var(--green-bg)] text-[var(--green)]",
    };
  }
  if (downloadState === "downloading") {
    return {
      text: "downloading",
      className: "bg-[var(--surface-alt)] text-[var(--text-tertiary)]",
    };
  }
  if (downloadState === "downloaded") {
    return {
      text: "on device",
      className: "bg-[var(--olive-bg)] text-[var(--olive)]",
    };
  }
  if (desktopOnly) {
    return {
      text: "desktop",
      className: "bg-[var(--surface-alt)] text-[var(--text-muted)]",
    };
  }
  return null;
};

export const ModelStatusTag = ({
  downloadState,
  loadState,
  desktopOnly,
}: Props) => {
  const tag = getTag(downloadState, loadState, desktopOnly);
  if (!tag) return null;

  return (
    <span
      className={`rounded-xs px-2 py-0.5 text-[length:var(--font-size-xs)] font-semibold uppercase tracking-tight ${tag.className}`}
    >
      {tag.text}
    </span>
  );
};
