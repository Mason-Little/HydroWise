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
      className="app-overview-rail-panel h-full min-h-0 overflow-hidden"
      aria-labelledby="overview-policies-heading"
    >
      <header
        className={cn(
          "app-overview-rail-panel__head app-overview-policies__head shrink-0 px-3.5 pt-3 pb-2.5",
          compressed
            ? "app-overview-rail-panel__head--flush flex h-full min-h-0 items-center py-0 pr-3.5 pl-3.5"
            : "pb-2",
        )}
      >
        <h2
          id="overview-policies-heading"
          className="app-overview-policies__title"
        >
          Policies
        </h2>
        {!compressed ? (
          <p className="app-overview-policies__subtitle">
            Course rules and expectations
          </p>
        ) : null}
      </header>
      {!compressed ? (
        <div className="app-overview-policies__scroll min-h-0 flex-1 overflow-y-auto">
          {policies.map((p) => (
            <article
              key={`${p.label}::${p.summary}`}
              className="app-overview-policies__row"
            >
              <h3 className="app-overview-policies__label">{p.label}</h3>
              <p className="app-overview-policies__summary">{p.summary}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};
