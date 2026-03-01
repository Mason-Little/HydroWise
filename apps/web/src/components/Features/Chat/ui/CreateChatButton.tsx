import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";

export const CreateChatButton = () => {
  const { setSelectedChatId } = useChatStore();

  return (
    <Button
      className="bg-secondary text-secondary-foreground border-border h-9 border px-3 font-semibold shadow-none hover:bg-secondary/80"
      onClick={() => setSelectedChatId(null)}
    >
      New Chat
    </Button>
  );
};
