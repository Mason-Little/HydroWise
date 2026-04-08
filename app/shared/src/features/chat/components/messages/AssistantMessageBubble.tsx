import type { ReactNode } from "react";

type AssistantMessageBubbleProps = {
  text: string;
  children?: ReactNode;
};

export const AssistantMessageBubble = ({
  text,
  children,
}: AssistantMessageBubbleProps) => (
  <div className="app-ask-msg-cluster app-ask-msg-cluster--assistant">
    <p className="app-ask-msg-meta">HydroWise</p>
    <div className="app-ask-bubble app-ask-bubble--assistant">
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
    {children != null ? children : null}
  </div>
);
