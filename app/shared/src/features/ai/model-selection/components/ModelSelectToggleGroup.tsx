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
        indicatorClassName="inset-y-1 rounded-[var(--hw-radius-lg)] border border-[var(--border-solid)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
        className="relative grid w-full grid-cols-5 rounded-[var(--hw-radius-xl)] border border-[var(--border-solid)] bg-[color:color-mix(in_srgb,var(--surface-alt)_82%,white)] p-1 shadow-[var(--shadow-sm)]"
      >
        {LANGUAGE_MODELS.map((model) => {
          const isSelected = selectedModelId === model.id;
          const desktopOnly = !model.web.enabled;

          return (
            <ToggleGroupItem
              key={model.id}
              value={model.id}
              aria-label={`${model.label} model`}
              className={cn(
                "h-8 w-full overflow-hidden rounded-[var(--hw-radius-lg)] border border-transparent bg-transparent px-1 text-[var(--text-muted)] shadow-none transition-[color,border-color,transform] duration-200 hover:bg-transparent hover:text-[var(--text-secondary)] focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]",
                isSelected
                  ? "text-[var(--text-primary)]"
                  : "border-transparent",
              )}
            >
              <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-1 rounded-[var(--hw-radius-md)] px-1.5">
                <span className="text-xs font-semibold tracking-normal">
                  {model.label}
                </span>
                {desktopOnly ? (
                  <LockIcon
                    className={cn(
                      "size-3",
                      isSelected
                        ? "text-[var(--text-tertiary)]"
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
