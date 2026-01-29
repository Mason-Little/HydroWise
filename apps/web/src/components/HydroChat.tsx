import { HydroInputContainer } from "@/components/ui/HydroInputContainer";
import { HydroMessage } from "@/components/ui/HydroMessage";
import { useChat } from "@/hooks/useChat";
import { useWebLLMEngine } from "@/hooks/useWebLLMEngine";

export const HydroChat = () => {
  const { messages, submitMessage } = useChat();
  const { engineReady, loadProgress } = useWebLLMEngine();

  const handleSend = async (message: string) => {
    if (!engineReady) return;
    await submitMessage(message);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-20 flex justify-center px-6 pb-6">
      <div className="glass-panel flex w-full max-w-3xl flex-col gap-6 px-8 py-7">
        <div className="scroll-styled flex max-h-[50vh] flex-col gap-4 overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <HydroMessage key={`${message.role}-${index}`} message={message} />
          ))}
        </div>
        <HydroInputContainer
          onSend={handleSend}
          disabled={!engineReady}
          loadingProgress={loadProgress}
        />
      </div>
    </div>
  );
};
