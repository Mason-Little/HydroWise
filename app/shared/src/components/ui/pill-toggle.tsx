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
      indicatorClassName="app-dashboard-view-toggle__indicator"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
      className={cn(
        "app-dashboard-view-toggle relative grid items-stretch",
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
            className="app-dashboard-view-toggle__item h-full min-h-0 min-w-0 w-full overflow-hidden rounded-md border border-transparent bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring aria-pressed:bg-transparent"
          >
            <span className="app-dashboard-view-toggle__item-inner relative z-10 inline-flex h-full w-full items-center justify-center gap-1 rounded-md px-0.5">
              {textLabel !== null ? (
                <span className="app-dashboard-view-toggle__label">
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
