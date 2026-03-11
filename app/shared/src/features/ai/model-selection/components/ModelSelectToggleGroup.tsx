"use client";

import { LANGUAGE_MODELS, type LanguageModelId } from "@hydrowise/ai-runtime";
import { LockIcon } from "lucide-react";
import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useModelSelectorStore } from "@/store/modelSelectorStore";

export const ModelSelectToggleGroup = () => {
  const { selectModel, selectedModelId } = useModelSelectorStore(
    useShallow((s) => ({
      selectModel: s.selectModel,
      selectedModelId: s.selectedModelId,
    })),
  );

  const handleValueChange = ([nextValue]: string[]) => {
    if (!nextValue) {
      return;
    }

    selectModel(nextValue as LanguageModelId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <ToggleGroup
        orientation="horizontal"
        value={[selectedModelId]}
        onValueChange={handleValueChange}
        spacing={1}
        aria-label="AI model selection"
        indicatorClassName="inset-y-1 rounded-lg border border-border bg-card shadow-sm"
        className="relative grid w-full grid-cols-5 rounded-xl border border-border bg-[var(--surface-toggle-track)] p-1 shadow-sm"
      >
        {LANGUAGE_MODELS.map((model) => {
          const isSelected = selectedModelId === model.id;
          const desktopOnly = !model.webModelId;

          return (
            <ToggleGroupItem
              key={model.id}
              value={model.id}
              aria-label={`${model.label} model`}
              className={cn(
                "h-8 w-full overflow-hidden rounded-lg border border-transparent bg-transparent px-1 text-muted-foreground shadow-none transition-[color,border-color,transform] duration-200 hover:bg-transparent hover:text-secondary-foreground focus-visible:ring-1 focus-visible:ring-ring",
                isSelected ? "text-foreground" : "border-transparent",
              )}
            >
              <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-1 rounded-md px-1.5">
                <span className="text-xs font-semibold tracking-normal">
                  {model.label}
                </span>
                {desktopOnly ? (
                  <LockIcon
                    className={cn(
                      "size-3",
                      isSelected
                        ? "text-muted-2"
                        : "text-[var(--text-disabled)]",
                    )}
                    strokeWidth={2.1}
                  />
                ) : null}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </motion.div>
  );
};
