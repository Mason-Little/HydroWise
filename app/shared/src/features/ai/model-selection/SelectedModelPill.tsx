import { getLanguageModelDefinition } from "@hydrowise/ai-runtime";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { ModelSelect } from "@/features/ai/model-selection/ModelSelect";
import { cn } from "@/lib/utils";
import { useModelSelectorStore } from "@/store/modelSelectorStore";

export const SelectedModelPill = () => {
  const [open, setOpen] = useState(false);
  const activeModelId = useModelSelectorStore((s) => s.activeModelId);
  const model = getLanguageModelDefinition(activeModelId);

  return (
    <ModelSelect open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={cn(
          "text-foreground inline-flex h-9 items-center gap-2.5 rounded-[var(--hw-radius-xl)] border border-[var(--border)] px-3.5 shadow-[var(--shadow-sm)] transition-colors",
          open ? "bg-[var(--secondary)]" : "bg-[var(--surface)]",
        )}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex size-3.5 items-center justify-center rounded-full bg-[var(--green-bg)]">
            <span className="size-2 rounded-full bg-[var(--green)]" />
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {model.label}
          </span>
        </span>
        <ChevronDownIcon
          className={`size-3.5 text-[var(--text-secondary)] transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          strokeWidth={2.25}
        />
      </button>
    </ModelSelect>
  );
};
