import {
  CheckIcon,
  DownloadIcon,
  FlameIcon,
  Loader2Icon,
  MonitorIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ModelActionVariant =
  | "download"
  | "warmup"
  | "warming"
  | "active"
  | "locked";

type Props = {
  variant: ModelActionVariant;
  onClick: () => void;
};

const styles: Record<ModelActionVariant, string> = {
  download:
    "border-transparent bg-[var(--btn-download-bg)] text-[var(--btn-download-text)]",
  warmup:
    "border-transparent bg-[image:var(--btn-warmup-bg)] text-[var(--btn-warmup-text)]",
  warming:
    "border-transparent bg-[var(--btn-warming-bg)] text-[var(--btn-warming-text)] opacity-70",
  active:
    "border-[var(--btn-active-border)] bg-[var(--btn-active-bg)] text-[var(--btn-active-text)]",
  locked:
    "border-[var(--btn-locked-border)] bg-[var(--btn-locked-bg)] text-[var(--btn-locked-text)] opacity-70",
};

const renderIcon = (variant: ModelActionVariant) => {
  if (variant === "download")
    return <DownloadIcon className="size-[var(--size-icon-sm)]" />;
  if (variant === "warmup")
    return <FlameIcon className="size-[var(--size-icon-sm)]" />;
  if (variant === "warming")
    return <Loader2Icon className="size-[var(--size-icon-sm)] animate-spin" />;
  if (variant === "active")
    return <CheckIcon className="size-[var(--size-icon-sm)]" />;
  return <MonitorIcon className="size-[var(--size-icon-sm)]" />;
};

const renderLabel = (variant: ModelActionVariant) => {
  if (variant === "download") return "Download";
  if (variant === "warmup") return "Warm Up";
  if (variant === "warming") return "Loading…";
  if (variant === "active") return "Active";
  return "Desktop Only";
};

export const ModelActionButton = ({ variant, onClick }: Props) => {
  const clickable = variant === "download" || variant === "warmup";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        styles[variant],
      )}
      disabled={!clickable}
    >
      {renderIcon(variant)}
      {renderLabel(variant)}
    </button>
  );
};
