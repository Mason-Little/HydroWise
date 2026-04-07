"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Command, CommandInput } from "@/components/ui/command";
import { ToolbarCommandMenu } from "@/features/app-toolbar/actions/ToolbarCommandMenu";
import {
  focusToolbarCommandInput,
  isModKShortcut,
  shouldIgnoreGlobalToolbarCommandShortcut,
} from "@/features/app-toolbar/actions/toolbarCommandBar";
import { cn } from "@/lib/utils";

const resultsPanelClassName = cn(
  "absolute top-[calc(100%+8px)] left-0 z-50 w-full overflow-hidden rounded-[14px] border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] text-[12px] text-[var(--app-text-primary)] shadow-[var(--app-shadow-lift)]",
  "[&_[data-slot=command-item]>svg:last-child]:hidden",
);

export const AppActionBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target;
      if (t instanceof Node && !rootRef.current?.contains(t)) dismiss();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, dismiss]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isModKShortcut(e)) return;
      if (shouldIgnoreGlobalToolbarCommandShortcut(rootRef.current)) return;

      e.preventDefault();
      if (open) {
        dismiss();
        return;
      }
      setOpen(true);
      focusToolbarCommandInput(commandInputRef, rootRef.current);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, dismiss]);

  return (
    <div
      ref={rootRef}
      className="relative w-full min-w-0 max-w-[760px] justify-self-center"
    >
      <Command
        shouldFilter={false}
        aria-label="Search and actions"
        className="overflow-visible rounded-none bg-transparent p-0 shadow-none"
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          e.preventDefault();
          dismiss();
        }}
      >
        <div
          className={cn(
            "rounded-xl border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] px-2 py-1.5 shadow-none transition-[border-color,box-shadow] duration-[180ms] ease-out dark:bg-[var(--app-surface-primary)]",
            "focus-within:border-[color-mix(in_srgb,var(--app-accent)_38%,var(--app-border-solid))] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--app-accent)_12%,transparent)]",
            open &&
              "border-[color-mix(in_srgb,var(--app-accent)_38%,var(--app-border-solid))] shadow-[0_0_0_3px_color-mix(in_srgb,var(--app-accent)_12%,transparent)]",
            "[&_[data-slot=command-input-wrapper]]:p-0",
            "[&_[data-slot=input-group]]:min-h-10 [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:ring-0 dark:[&_[data-slot=input-group]]:bg-transparent",
          )}
        >
          <CommandInput
            ref={commandInputRef}
            className="text-[12px] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)] [&::-webkit-search-cancel-button]:hidden"
            placeholder="Search, open, paste, or upload…"
            value={searchQuery}
            onValueChange={(v) => {
              setSearchQuery(v);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            aria-expanded={open}
            aria-controls={open ? "app-action-results" : undefined}
          />
        </div>

        {open ? (
          <div className={resultsPanelClassName}>
            <ToolbarCommandMenu searchQuery={searchQuery} onDismiss={dismiss} />
          </div>
        ) : null}
      </Command>
    </div>
  );
};
