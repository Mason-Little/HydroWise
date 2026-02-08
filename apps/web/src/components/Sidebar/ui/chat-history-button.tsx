import { useChatStore } from "@/store/chatStore";
import { Button } from "../../ui/button";

type ChatHistoryButtonProps = {
  chatId: string;
  chatName: string;
  onSelect: (chatId: string) => void;
  onDelete: (chatId: string) => void;
};

export const ChatHistoryButton = ({
  chatId,
  chatName,
  onSelect,
  onDelete,
}: ChatHistoryButtonProps) => {
  const { selectedChatId } = useChatStore();

  if (selectedChatId === chatId) {
    return (
      <div className="group flex items-center gap-1 rounded-xl bg-sidebar-accent/70 p-1">
        <Button
          variant="secondary"
          className="h-8 flex-1 justify-start rounded-lg px-2 text-xs"
          onClick={() => onSelect(chatId)}
        >
          <span className="truncate">{chatName}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-xs"
          disabled
          onClick={() => onDelete(chatId)}
        >
          Delete
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-1 rounded-xl p-1 transition-colors hover:bg-sidebar-accent/40">
      <Button
        variant="ghost"
        className="h-8 flex-1 justify-start rounded-lg px-2 text-xs"
        onClick={() => onSelect(chatId)}
      >
        <span className="truncate">{chatName}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 rounded-lg px-2 text-xs text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(chatId)}
      >
        Delete
      </Button>
    </div>
  );
};
