import type { ChatMessage } from "@hydrowise/entities";
import { AssistantMessageBubble } from "./AssistantMessageBubble";
import { GroundedChatMessage } from "./GroundedChatMessage";

type AssistantChatMessageProps = {
  message: ChatMessage;
};

export const AssistantChatMessage = ({
  message,
}: AssistantChatMessageProps) => {
  if (message.payload.kind === "grounded-answer") {
    return <GroundedChatMessage message={message} />;
  }

  return <AssistantMessageBubble text={message.payload.text} />;
};
