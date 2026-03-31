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
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[13px] border border-border/30 bg-[color-mix(in_srgb,var(--surface)_93%,var(--bg))] shadow-[0_1px_0_color-mix(in_srgb,var(--surface)_78%,transparent)_inset,0_4px_14px_rgba(37,50,58,0.022)]"
      aria-labelledby="overview-policies-heading"
    >
      <header
        className={cn(
          "shrink-0 px-3.5 pt-[11px] pb-2",
          compressed
            ? "flex h-full min-h-0 items-center border-transparent py-0 pr-3.5 pl-3.5"
            : "border-border/28 border-b pb-[9px]",
        )}
      >
        <h2
          id="overview-policies-heading"
          className="font-display truncate text-[length:var(--type-dashboard-body)] leading-[1.15] font-bold tracking-[-0.025em] text-[var(--text-primary)]"
        >
          Policies
        </h2>
      </header>
      {!compressed ? (
        <div className="min-h-0 flex-1 overflow-y-auto py-2 pr-2 pb-4 pl-3.5 [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--hairline)_78%,transparent)_transparent]">
          {policies.map((p) => (
            <p
              key={`${p.label}:${p.summary}`}
              className="mb-[11px] text-[length:var(--type-dashboard-micro)] leading-[1.45] last:mb-0"
            >
              <strong className="mr-1 font-bold tracking-[-0.012em] text-[#5f6d77]">
                {p.label}
              </strong>
              <span className="font-normal text-[color-mix(in_srgb,var(--text-secondary)_68%,var(--text-tertiary))]">
                {" "}
                — {p.summary}
              </span>
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
};
