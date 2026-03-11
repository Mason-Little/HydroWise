import {
  CheckIcon,
  DownloadIcon,
  FlameIcon,
  Loader2Icon,
  MonitorIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type ModelActionVariant =
  | "download"
  | "progress"
  | "warmup"
  | "warming"
  | "active"
  | "locked";

type Props = {
  variant: ModelActionVariant;
  progressPercent?: number;
  onClick: () => void;
  shake?: boolean;
};

const styles: Record<ModelActionVariant, string> = {
  download:
    "border-transparent bg-[var(--btn-download-bg)] text-[var(--btn-download-text)]",
  progress:
    "border-transparent bg-[var(--btn-warming-bg)] text-[var(--btn-warming-text)] opacity-70",
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
  if (variant === "download") return <DownloadIcon className="size-[13px]" />;
  if (variant === "warmup") return <FlameIcon className="size-[13px]" />;
  if (variant === "warming" || variant === "progress") {
    return <Loader2Icon className="size-[13px] animate-spin" />;
  }
  if (variant === "active") return <CheckIcon className="size-[13px]" />;
  return <MonitorIcon className="size-[13px]" />;
};

const renderLabel = (variant: ModelActionVariant, progressPercent?: number) => {
  if (variant === "download") return "Download";
  if (variant === "warmup") return "Warm Up";
  if (variant === "warming") return "Loading…";
  if (variant === "progress") return `${progressPercent ?? 0}%`;
  if (variant === "active") return "Active";
  return "Desktop Only";
};

export const ModelActionButton = ({
  variant,
  progressPercent,
  onClick,
  shake = false,
}: Props) => {
  const clickable = variant === "download" || variant === "warmup";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={shake ? { x: [0, -4, 4, -2, 2, 0] } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-[5px] rounded-[var(--hw-radius-sm)] border px-[14px] py-[6px] text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]",
        styles[variant],
      )}
      disabled={!clickable}
    >
      {renderIcon(variant)}
      {renderLabel(variant, progressPercent)}
    </motion.button>
  );
};
