type ScopeSummaryProps = {
  title: string;
  description: string;
};

export const ScopeSummary = ({ title, description }: ScopeSummaryProps) => {
  return (
    <div className="rounded-[24px] border border-border/60 bg-[var(--app-surface-primary)] p-5 shadow-[0_1px_0_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)]">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--course-accent-strong)_72%,transparent)]">
        {title}
      </p>
      <p className="mt-2 max-w-2xl text-[0.96rem] font-medium leading-6 text-[var(--app-text-muted)]">
        {description}
      </p>
    </div>
  );
};
