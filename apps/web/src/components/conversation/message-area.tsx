import type { Message } from "@hydrowise/entities";
import { ScrollArea } from "@/components/ui/scroll-area";

type MessageAreaProps = {
  messages: Message[];
};

export const MessageArea = ({ messages }: MessageAreaProps) => {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-3 px-3 py-4 md:px-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed md:max-w-[75%] ${
              message.role === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted text-foreground"
            }`}
          >
            {message.content}
          </div>
        ))}
        {messages.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            Start your first conversation.
          </div>
        ) : null}
      </div>
    </ScrollArea>
  );
};
