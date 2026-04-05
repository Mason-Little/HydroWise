import type { ChatMessage } from "@hydrowise/entities";
import { AssistantChatMessage } from "./AssistantChatMessage";
import { UserChatMessage } from "./UserChatMessage";

type ChatMessageItemProps = {
  message: ChatMessage;
};

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  if (message.role === "user") {
    return <UserChatMessage message={message} />;
  }
  return <AssistantChatMessage message={message} />;
};
