import type { Message } from "@hydrowise/entities";

type Props = {
  message: Message;
};

export const HydroMessage = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`message ${isUser ? "message-user" : "message-glass"}`}>
      {message.content}
    </div>
  );
};
