import type { Topic } from "@hydrowise/entities";
import { useTopicDocuments } from "@/features/dashboard/Info/material/hooks/useTopicDocuments";
import { cn } from "@/lib/utils";
import { MaterialDocumentTile } from "./MaterialDocumentTile";

type MaterialTopicSectionProps = {
  topic: Topic;
  sectionIndex: number;
};

const TOPIC_CARD_BASE =
  "rounded-xl border px-3.5 pb-3 pt-3.5 shadow-[0_1px_0_color-mix(in_srgb,var(--app-surface-primary)_75%,transparent)_inset,0_1px_2px_rgba(37,50,58,0.03)]";

const TOPIC_CARD_TONES = [
  [
    "border-[color-mix(in_srgb,var(--app-border-solid)_32%,#e0d9d0)]",
    "bg-gradient-to-b from-[color-mix(in_srgb,var(--app-surface-primary)_91%,#f3efe9)] to-[color-mix(in_srgb,var(--app-surface-primary)_88%,var(--app-workspace-bg))]",
  ],
  [
    "border-[color-mix(in_srgb,var(--course-accent-ring)_14%,var(--app-border-solid))]",
    "bg-gradient-to-b from-[color-mix(in_srgb,var(--app-surface-primary)_92%,var(--course-accent-soft))] to-[color-mix(in_srgb,var(--app-surface-primary)_88%,var(--app-workspace-bg))]",
  ],
  [
    "border-[color-mix(in_srgb,var(--app-border-solid)_30%,#d2dde8)]",
    "bg-gradient-to-b from-[color-mix(in_srgb,var(--app-surface-primary)_92%,var(--app-workspace-bg))] to-[color-mix(in_srgb,var(--app-surface-primary)_88%,var(--app-workspace-bg))]",
  ],
  [
    "border-[color-mix(in_srgb,var(--app-border-solid)_30%,#e8dfd0)]",
    "bg-gradient-to-b from-[color-mix(in_srgb,var(--app-surface-primary)_92%,#f5f0e8)] to-[color-mix(in_srgb,var(--app-surface-primary)_88%,var(--app-workspace-bg))]",
  ],
] as const;

const topicCardToneClass = (sectionIndex: number): string => {
  const [border, bg] = TOPIC_CARD_TONES[sectionIndex % 4];
  return cn(TOPIC_CARD_BASE, border, bg);
};

export const MaterialTopicSection = ({
  topic,
  sectionIndex,
}: MaterialTopicSectionProps) => {
  const { documents, isLoading } = useTopicDocuments(topic.id);
  const headingId = `material-topic-${topic.id}`;
  const docCount = isLoading ? null : (documents?.length ?? 0);

  return (
    <section aria-labelledby={headingId} className="mt-5">
      <div className={topicCardToneClass(sectionIndex)}>
        <header className="mb-3 flex items-start justify-between gap-3.5 border-b border-[color-mix(in_srgb,var(--course-accent-ring)_12%,var(--app-hairline))] pb-2.5">
          <div className="min-w-0 flex-1">
            <h3
              id={headingId}
              className={cn(
                "font-display text-[13px] font-semibold leading-snug tracking-[-0.02em]",
                "text-[var(--app-text-primary)]",
              )}
            >
              {topic.name}
            </h3>
            {topic.description.trim() ? (
              <p
                className={cn(
                  "mt-1.5 max-w-[38rem] text-[11px] font-medium leading-[1.45]",
                  "text-[var(--app-text-muted)]",
                )}
              >
                {topic.description}
              </p>
            ) : null}
          </div>
          <span
            role="img"
            className={cn(
              "shrink-0 rounded-full border border-[color-mix(in_srgb,var(--app-border-solid)_28%,transparent)] px-2 py-0.5 text-[10px] font-semibold tabular-nums tracking-wide",
              "bg-[color-mix(in_srgb,var(--app-workspace-bg)_55%,var(--app-surface-primary))]",
              "text-[var(--app-text-tertiary)]",
            )}
            aria-label={
              docCount !== null ? `${docCount} files` : "Loading file count"
            }
          >
            {docCount !== null ? docCount : "…"}
          </span>
        </header>
        <div className="flex flex-col gap-2">
          {!isLoading && documents
            ? documents.map((document) => (
                <MaterialDocumentTile key={document.id} document={document} />
              ))
            : null}
        </div>
      </div>
    </section>
  );
};
