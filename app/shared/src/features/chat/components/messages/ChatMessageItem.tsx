import type { ChatMessage } from "@hydrowise/entities";
import { AssistantChatMessage } from "./AssistantChatMessage";
import { UserChatMessage } from "./UserChatMessage";

type ChatMessageItemProps = {
  message: ChatMessage;
};

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  if (message.role === "user") {
    return (
      <div className="app-ask-msg-row app-ask-msg-row--user">
        <UserChatMessage message={message} />
      </div>
    );
  }
  return (
    <div className="app-ask-msg-row app-ask-msg-row--assistant">
      <AssistantChatMessage message={message} />
    </div>
  );
};
