import type {
  ChatMessage,
  GroundedAssistantCitationPayload,
} from "@hydrowise/entities";
import { useState } from "react";
import { PageImagePreviewDialog } from "@/features/document-viewer/PageImagePreviewDialog";
import { AssistantMessageBubble } from "./AssistantMessageBubble";

type GroundedChatMessageProps = {
  message: ChatMessage;
};

const citationHasPageId = (
  ref: GroundedAssistantCitationPayload,
): ref is GroundedAssistantCitationPayload & { pageId: string } =>
  ref.pageId != null && ref.pageId !== "";

export const GroundedChatMessage = ({ message }: GroundedChatMessageProps) => {
  const [previewPageId, setPreviewPageId] = useState<string | null>(null);

  if (message.payload.kind !== "grounded-answer") {
    return null;
  }

  const citedPages = message.payload.refs.filter(citationHasPageId);

  return (
    <>
      <AssistantMessageBubble text={message.payload.text}>
        {citedPages.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {citedPages.map((ref, i) => (
              <button
                key={`${ref.pageId}:${ref.excerpt ?? ""}`}
                type="button"
                className="grid gap-1 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--app-border-solid)_56%,transparent)] bg-[color-mix(in_srgb,var(--app-course-sage)_18%,var(--app-surface-primary))] px-3 py-2 text-left text-[length:var(--type-dashboard-topbar)] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] transition-transform hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--app-course-sage)_24%,var(--app-surface-primary))]"
                onClick={() => setPreviewPageId(ref.pageId)}
              >
                <span className="font-medium text-[var(--app-text-primary)]">
                  Source {i + 1}
                </span>
                {ref.excerpt != null && ref.excerpt.trim() !== "" ? (
                  <span className="line-clamp-2 text-[var(--app-text-muted)]">
                    {ref.excerpt.trim()}
                  </span>
                ) : null}
                <span className="text-[length:var(--type-dashboard-micro)] font-medium uppercase tracking-[0.16em] text-[var(--app-accent-strong)]">
                  Open preview
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </AssistantMessageBubble>
      {previewPageId != null ? (
        <PageImagePreviewDialog
          pageId={previewPageId}
          open
          onOpenChange={(next) => {
            if (!next) setPreviewPageId(null);
          }}
        />
      ) : null}
    </>
  );
};
