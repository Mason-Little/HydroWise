import { TopicSelector } from "@/features/quiz/modules/create/selection/TopicSelector";

export const TopicScopePanel = () => {
  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-[var(--app-border-solid)] pb-2.5">
        <div className="min-w-0">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-foreground">
            Choose topics
          </p>
          <p className="mt-1 max-w-2xl text-[0.95rem] font-medium leading-6 text-[var(--app-text-muted)]">
            Pick the topics you want included in this quiz set.
          </p>
        </div>
        <div
          className="h-px min-w-20 flex-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--app-text-muted)_26%,transparent),transparent)]"
          aria-hidden
        />
      </div>
      <div className="rounded-[18px] border border-border/60 bg-[var(--app-surface-primary)] px-3.5 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)]">
        <TopicSelector />
      </div>
    </div>
  );
};
