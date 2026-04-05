import type {
  ChatMessage,
  GroundedAssistantCitationPayload,
} from "@hydrowise/entities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
          <div className="mt-2 flex flex-wrap gap-1.5">
            {citedPages.map((ref, i) => (
              <Button
                key={`${ref.pageId}:${ref.excerpt ?? ""}`}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[11px]"
                onClick={() => setPreviewPageId(ref.pageId)}
              >
                Source {i + 1}
              </Button>
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
