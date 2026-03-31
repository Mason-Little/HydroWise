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
    if (nextValue) onValueChange(nextValue as T);
  };

  return (
    <ToggleGroup
      orientation="horizontal"
      value={[value]}
      onValueChange={handleValueChange}
      spacing={1}
      aria-label={ariaLabel}
      indicatorClassName="inset-y-1 rounded-md border border-border/45 bg-card shadow-[var(--app-shadow-soft)]"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
      className={cn(
        "relative grid w-full rounded-[10px] border border-border/40 bg-[var(--surface-toggle-track)] p-0.5 shadow-[var(--app-shadow-soft)]",
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
            className="h-7 w-full overflow-hidden rounded-md border border-transparent bg-transparent px-1 text-muted-foreground shadow-none transition-colors duration-150 ease-out hover:bg-transparent hover:text-secondary-foreground focus-visible:ring-1 focus-visible:ring-ring data-[state=on]:text-foreground"
          >
            <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-1 rounded-md px-1">
              {textLabel !== null ? (
                <span className="text-[11px] font-semibold tracking-normal">
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
