"use client";

import type { ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type PillToggleOption<T extends string = string> = {
  value: T;
  label: ReactNode;
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
    if (!nextValue) return;
    const selected = options.find((o) => o.value === nextValue);
    if (selected) onValueChange(selected.value);
  };

  return (
    <ToggleGroup
      orientation="horizontal"
      value={[value]}
      onValueChange={handleValueChange}
      spacing={0}
      aria-label={ariaLabel}
      indicatorClassName="pointer-events-none bg-background shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_4px_12px_rgba(37,50,58,0.08)]"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
      className={cn(
        "relative grid items-stretch gap-0 rounded-[var(--radius-md)] border border-border/60 bg-muted/50 p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_0_rgba(37,50,58,0.03)]",
        className,
      )}
    >
      {options.map((option) => {
        const textLabel =
          typeof option.label === "string" ? option.label : null;
        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={textLabel ?? option.value}
            className="group relative h-full min-h-0 min-w-0 w-full overflow-hidden rounded-none border border-transparent bg-transparent px-1 py-1 text-[length:var(--type-dashboard-topbar)] font-medium text-muted-foreground shadow-none transition-colors focus-visible:ring-1 focus-visible:ring-ring aria-pressed:bg-transparent aria-pressed:text-foreground"
          >
            <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-1 px-0.5">
              {textLabel !== null ? (
                <span className="text-[length:var(--type-dashboard-topbar)]">
                  {textLabel}
                </span>
              ) : (
                option.label
              )}
            </span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};
