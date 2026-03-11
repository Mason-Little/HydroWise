import type {
  LanguageModelDownloadState,
  LanguageModelLoadState,
} from "@hydrowise/ai-runtime";

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
  if (loadState === "warming") {
    return {
      text: "loading",
      className: "bg-[var(--gold-bg)] text-[var(--gold)]",
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
      className={`rounded-[var(--hw-radius-xs)] px-[7px] py-[2px] text-[10px] font-semibold uppercase tracking-[0.03em] ${tag.className}`}
    >
      {tag.text}
    </span>
  );
};
