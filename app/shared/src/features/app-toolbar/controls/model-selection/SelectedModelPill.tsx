import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useModelStore } from "@/store/modelStore";
import { ModelSelect } from "./ModelSelect";

type IndicatorStatus = "active" | "loading" | "inactive";

function statusDotClass(status: IndicatorStatus): string {
  switch (status) {
    case "active":
      return "bg-[color-mix(in_srgb,var(--app-accent)_62%,var(--app-surface-secondary))]";
    case "loading":
      return "bg-[color-mix(in_srgb,var(--app-text-tertiary)_46%,var(--app-surface-primary))] motion-safe:animate-pulse";
    default:
      return "bg-[color-mix(in_srgb,var(--app-text-tertiary)_30%,var(--app-surface-secondary))]";
  }
}

function indicatorStatus(
  isWarmingModel: boolean,
  hasActiveDownload: boolean,
  hasActiveModel: boolean,
): IndicatorStatus {
  if (isWarmingModel || hasActiveDownload) return "loading";
  if (hasActiveModel) return "active";
  return "inactive";
}

export const SelectedModelPill = () => {
  const [open, setOpen] = useState(false);
  const activeModelTier = useModelStore((s) => s.activeModelTier);
  const isWarmingModel = useModelStore((s) => s.isWarmingModel);
  const activeDownload = useModelStore((s) => s.activeDownload);

  const status = indicatorStatus(
    isWarmingModel,
    activeDownload !== null,
    activeModelTier !== null,
  );

  return (
    <ModelSelect open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--app-hairline)] bg-[color-mix(in_srgb,var(--app-workspace-bg)_58%,var(--app-surface-primary))] px-3.5 text-[11px] font-semibold text-[var(--app-text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(37,50,58,0.07)] transition-colors",
          open &&
            "bg-[color-mix(in_srgb,var(--app-workspace-bg)_72%,var(--app-surface-primary))]",
        )}
      >
        <span
          className={cn(
            "size-[7px] shrink-0 rounded-full",
            statusDotClass(status),
          )}
          aria-hidden
        />
        <span className="max-w-[9rem] truncate tabular-nums">
          {activeModelTier ?? "—"}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-3 shrink-0 text-[var(--app-text-tertiary)] transition-transform",
            open ? "rotate-180" : "rotate-0",
          )}
          strokeWidth={2}
        />
      </button>
    </ModelSelect>
  );
};
