"use client";

import { motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type PillToggleOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
};

type PillToggleProps<T extends string = string> = {
  options: PillToggleOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
};

export const PillToggle = <T extends string = string>({
  options,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
}: PillToggleProps<T>) => {
  const handleValueChange = ([nextValue]: string[]) => {
    if (nextValue) onValueChange(nextValue as T);
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
        value={[value]}
        onValueChange={handleValueChange}
        spacing={1}
        aria-label={ariaLabel}
        indicatorClassName="inset-y-1 rounded-lg border border-border bg-card shadow-sm"
        className={cn(
          "relative grid w-full rounded-xl border border-border bg-[var(--surface-toggle-track)] p-1 shadow-sm",
          `grid-cols-${options.length}`,
          className,
        )}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={typeof option.label === "string" ? option.label : option.value}
            className="h-8 w-full overflow-hidden rounded-lg border border-transparent bg-transparent px-1 text-muted-foreground shadow-none transition-[color,border-color,transform] duration-200 hover:bg-transparent hover:text-secondary-foreground focus-visible:ring-1 focus-visible:ring-ring data-[state=on]:text-foreground"
          >
            <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-1 rounded-md px-1.5">
              {typeof option.label === "string" ? (
                <span className="text-xs font-semibold tracking-normal">
                  {option.label}
                </span>
              ) : (
                option.label
              )}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </motion.div>
  );
};
