"use client";

import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ActionResultsPanel } from "./ActionResultsPanel";

export const AppActionBar = () => {
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!panelOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (el && e.target instanceof Node && el.contains(e.target)) return;
      closePanel();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [panelOpen, closePanel]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 max-w-[760px] justify-self-center"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-[var(--app-text-tertiary)] [&_svg]:size-[18px]"
        aria-hidden
      >
        <SearchIcon strokeWidth={1.75} />
      </div>
      <Input
        placeholder="Search, open, paste, or upload…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPanelOpen(true);
        }}
        onFocus={() => {
          setPanelOpen(true);
        }}
        className="h-12 w-full rounded-xl border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] pr-4 pl-[42px] text-[12px] text-[var(--app-text-primary)] shadow-none outline-none placeholder:text-[var(--app-text-tertiary)] focus-visible:border-[color-mix(in_srgb,var(--app-accent)_38%,var(--app-border-solid))] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--app-accent)_12%,transparent)]"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={panelOpen}
        aria-controls={panelOpen ? "app-action-results" : undefined}
      />
      {panelOpen ? (
        <div
          id="app-action-results"
          role="listbox"
          className="absolute top-[calc(100%+8px)] z-50 max-h-[min(24rem,70vh)] w-full overflow-y-auto rounded-[var(--app-radius-workspace)] border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] p-2 text-[12px] text-popover-foreground shadow-[var(--app-shadow-lift)]"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          <ActionResultsPanel query={query} onClosePanel={closePanel} />
        </div>
      ) : null}
    </div>
  );
};
