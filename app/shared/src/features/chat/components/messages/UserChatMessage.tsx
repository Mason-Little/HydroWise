import type { ChatMessage } from "@hydrowise/entities";

type UserChatMessageProps = {
  message: ChatMessage;
};

export const UserChatMessage = ({ message }: UserChatMessageProps) => {
  if (message.payload.kind !== "user-text") {
    return null;
  }

  return (
    <div className="app-ask-msg-cluster app-ask-msg-cluster--user">
      <p className="app-ask-msg-meta">You</p>
      <div className="app-ask-bubble app-ask-bubble--user">
        <p className="whitespace-pre-wrap">{message.payload.text}</p>
      </div>
    </div>
  );
};
