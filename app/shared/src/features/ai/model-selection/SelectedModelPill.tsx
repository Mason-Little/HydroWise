import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useModelStore } from "@/store/modelStore";
import { ModelSelect } from "./ModelSelect";

export const SelectedModelPill = () => {
  const [open, setOpen] = useState(false);
  const { activeModelTier } = useModelStore();

  return (
    <ModelSelect open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={cn(
          "text-foreground inline-flex h-9 items-center gap-2.5 rounded-xl border border-border px-3.5 shadow-sm transition-colors",
          open ? "bg-secondary" : "bg-card",
        )}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex size-3.5 items-center justify-center rounded-full bg-[var(--green-bg)]">
            <span className="size-2 rounded-full bg-[var(--green)]" />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {activeModelTier ?? "—"}
          </span>
        </span>
        <ChevronDownIcon
          className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          strokeWidth={2.25}
        />
      </button>
    </ModelSelect>
  );
};
