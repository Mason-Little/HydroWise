type Props = {
  isActive: boolean;
  isDownloading: boolean;
  isCached: boolean;
  desktopOnly: boolean;
};

const getTag = (
  props: Props,
): { text: string; className: string } | null => {
  if (props.isActive) {
    return { text: "loaded", className: "bg-[var(--green-bg)] text-[var(--green)]" };
  }
  if (props.isDownloading) {
    return { text: "downloading", className: "bg-[var(--surface-alt)] text-[var(--text-tertiary)]" };
  }
  if (props.isCached) {
    return { text: "on device", className: "bg-[var(--olive-bg)] text-[var(--olive)]" };
  }
  if (props.desktopOnly) {
    return { text: "desktop", className: "bg-[var(--surface-alt)] text-[var(--text-muted)]" };
  }
  return null;
};

export const ModelStatusTag = (props: Props) => {
  const tag = getTag(props);
  if (!tag) return null;

  return (
    <span
      className={`rounded-xs px-2 py-0.5 text-[length:var(--font-size-xs)] font-semibold uppercase tracking-tight ${tag.className}`}
    >
      {tag.text}
    </span>
  );
};
