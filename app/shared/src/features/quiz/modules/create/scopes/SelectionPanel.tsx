import type { ReactNode } from "react";

type SelectionPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export const SelectionPanel = ({
  title,
  description,
  children,
}: SelectionPanelProps) => {
  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 border-b border-[var(--app-border-solid)] bg-[var(--app-surface-primary)] px-3 pt-3 pb-2">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.16em] text-foreground">
              {title}
            </p>
            <p className="mt-1.5 max-w-2xl text-[0.98rem] font-medium leading-6 text-[var(--app-text-muted)]">
              {description}
            </p>
          </div>
          <div
            className="h-px min-w-20 flex-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--app-text-muted)_26%,transparent),transparent)]"
            aria-hidden
          />
        </div>
      </div>
      <div className="mx-3 mt-2.5 mb-3">{children}</div>
    </div>
  );
};
