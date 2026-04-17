import type { ChatMessage } from "@hydrowise/entities";
import { AssistantChatMessage } from "./AssistantChatMessage";
import { UserChatMessage } from "./UserChatMessage";

type ChatMessageItemProps = {
  message: ChatMessage;
};

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <UserChatMessage message={message} />
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <AssistantChatMessage message={message} />
    </div>
  );
};
