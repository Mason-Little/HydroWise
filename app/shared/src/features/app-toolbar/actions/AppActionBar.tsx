"use client";

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
    <div className="pointer-events-none absolute inset-x-0 flex justify-center px-3">
      <div className="pointer-events-auto w-full max-w-2xl min-w-0">
        <div ref={containerRef} className="relative w-full">
          <Input
            placeholder="Search features…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPanelOpen(true);
            }}
            onFocus={() => {
              setPanelOpen(true);
            }}
            className="h-8 w-full rounded-md border border-border bg-transparent outline outline-1 outline-border focus-visible:ring-0"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={panelOpen}
            aria-controls={panelOpen ? "app-action-results" : undefined}
          />
          {panelOpen ? (
            <div
              id="app-action-results"
              role="listbox"
              className="absolute top-full z-50 mt-1.5 max-h-[min(24rem,70vh)] w-full overflow-y-auto rounded-md border border-border bg-card p-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <ActionResultsPanel query={query} onClosePanel={closePanel} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
