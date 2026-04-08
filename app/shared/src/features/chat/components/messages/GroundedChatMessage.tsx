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
          <div className="app-ask-sources">
            {citedPages.map((ref, i) => (
              <button
                key={`${ref.pageId}:${ref.excerpt ?? ""}`}
                type="button"
                className="app-ask-source-chip"
                onClick={() => setPreviewPageId(ref.pageId)}
              >
                <span className="app-ask-source-chip-title">
                  Source {i + 1}
                </span>
                {ref.excerpt != null && ref.excerpt.trim() !== "" ? (
                  <span className="app-ask-source-chip-meta">
                    {ref.excerpt.trim()}
                  </span>
                ) : null}
                <span className="app-ask-source-chip-tag">Open preview</span>
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
