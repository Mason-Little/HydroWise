import type { Policy } from "@hydrowise/entities";
import { cn } from "@/lib/utils";

type PoliciesProps = {
  policies: Policy[];
  compressed?: boolean;
};

export const Policies = ({ policies, compressed }: PoliciesProps) => {
  if (policies.length === 0) return null;

  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_8px_24px_rgba(37,50,58,0.05)]"
      aria-labelledby="overview-policies-heading"
    >
      <header
        className={cn(
          "shrink-0 border-b border-[var(--app-hairline)] px-3.5 pt-3 pb-2.5",
          compressed
            ? "flex h-full min-h-0 items-center py-0 pr-3.5 pl-3.5"
            : "pb-2",
        )}
      >
        <h2
          id="overview-policies-heading"
          className="text-[length:var(--type-dashboard-label)] font-semibold tracking-[-0.02em] text-[var(--app-text-primary)]"
        >
          Policies
        </h2>
        {!compressed ? (
          <p className="mt-0.5 text-[length:var(--type-dashboard-micro)] text-[var(--app-text-muted)]">
            Course rules and expectations
          </p>
        ) : null}
      </header>
      {!compressed ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pb-3">
          {policies.map((p) => (
            <article
              key={`${p.label}::${p.summary}`}
              className="border-b border-[var(--app-hairline)] py-3 last:border-b-0"
            >
              <h3 className="text-[length:var(--type-dashboard-topbar)] font-medium text-[var(--app-text-primary)]">
                {p.label}
              </h3>
              <p className="mt-1 text-[length:var(--type-dashboard-body)] leading-relaxed text-[var(--app-text-muted)]">
                {p.summary}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};
