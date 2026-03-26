import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useModelStore } from "@/store/modelStore";
import { ModelSelect } from "./ModelSelect";

type IndicatorStatus = "active" | "loading" | "inactive";

const indicatorStyles: Record<IndicatorStatus, { outer: string; inner: string }> = {
  active: {
    outer: "bg-[var(--green-bg)]",
    inner: "bg-[var(--green)]",
  },
  loading: {
    outer: "bg-amber-500/20",
    inner: "bg-amber-500 animate-pulse",
  },
  inactive: {
    outer: "bg-red-500/20",
    inner: "bg-red-500",
  },
};

export const SelectedModelPill = () => {
  const [open, setOpen] = useState(false);
  const activeModelTier = useModelStore((s) => s.activeModelTier);
  const isWarmingModel = useModelStore((s) => s.isWarmingModel);
  const activeDownload = useModelStore((s) => s.activeDownload);

  const status: IndicatorStatus =
    isWarmingModel || activeDownload !== null
      ? "loading"
      : activeModelTier !== null
        ? "active"
        : "inactive";

  const { outer, inner } = indicatorStyles[status];

  return (
    <ModelSelect open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={cn(
          "text-foreground inline-flex h-8 items-center gap-2 rounded-lg border border-border px-3 shadow-sm transition-colors",
          open ? "bg-secondary" : "bg-card",
        )}
      >
        <span className="flex items-center gap-2">
          <span className={cn("flex size-3 items-center justify-center rounded-full", outer)}>
            <span className={cn("size-2 rounded-full", inner)} />
          </span>
          <span className="text-xs font-semibold text-foreground">
            {activeModelTier ?? "—"}
          </span>
        </span>
        <ChevronDownIcon
          className={`size-3 text-muted-foreground transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          strokeWidth={2.25}
        />
      </button>
    </ModelSelect>
  );
};
