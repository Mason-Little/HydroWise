"use client";

import {
  getLanguageModels,
  type LanguageModelTier,
} from "@hydrowise/ai-runtime";
import { LockIcon } from "lucide-react";
import { motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useModelStore } from "@/store/modelStore";

export const ModelSelectToggleGroup = () => {
  const { runtime, selectedModelTier, setSelectedModelTier } = useModelStore();

  const handleValueChange = ([nextValue]: string[]) => {
    if (nextValue) setSelectedModelTier(nextValue as LanguageModelTier);
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
        value={selectedModelTier ? [selectedModelTier] : []}
        onValueChange={handleValueChange}
        spacing={1}
        aria-label="AI model selection"
        indicatorClassName="inset-y-1 rounded-lg border border-border bg-card shadow-sm"
        className="relative grid w-full grid-cols-5 rounded-xl border border-border bg-[var(--surface-toggle-track)] p-1 shadow-sm"
      >
        {Object.entries(getLanguageModels()).map(([tier, definition]) => {
          const isSelected = selectedModelTier === tier;
          const desktopOnly = runtime === "web" && !definition.webModelId;

          return (
            <ToggleGroupItem
              key={tier}
              value={tier}
              aria-label={`${tier} model`}
              className={cn(
                "h-8 w-full overflow-hidden rounded-lg border border-transparent bg-transparent px-1 text-muted-foreground shadow-none transition-[color,border-color,transform] duration-200 hover:bg-transparent hover:text-secondary-foreground focus-visible:ring-1 focus-visible:ring-ring",
                isSelected ? "text-foreground" : "border-transparent",
              )}
            >
              <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-1 rounded-md px-1.5">
                <span className="text-xs font-semibold tracking-normal">
                  {tier}
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
