import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";

export const CreateChatButton = () => {
  const { setSelectedChatId } = useChatStore();

  return (
    <Button
      className="h-9 border border-black/10 bg-[#c4d5ff] px-3 font-semibold text-[#1f2a4a] shadow-none hover:bg-[#b4c5ef]"
      onClick={() => setSelectedChatId(null)}
    >
      New Chat
    </Button>
  );
};
