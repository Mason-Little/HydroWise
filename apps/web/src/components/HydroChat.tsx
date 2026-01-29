import { HydroInputContainer } from "@/components/ui/HydroInputContainer";
import { HydroMessage } from "@/components/ui/HydroMessage";
import { useChat } from "@/hooks/useChat";

export const HydroChat = () => {
  const { messages, sendMessage } = useChat();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-20 flex justify-center px-6 pb-6">
      <div
        className="flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] px-8 py-7 backdrop-blur-[16px]"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--glass-surface)), hsl(var(--glass-highlight)))",
          border: "1px solid hsl(var(--glass-border))",
          boxShadow:
            "0 18px 48px hsl(var(--glass-shadow-strong)), 0 6px 18px hsl(var(--glass-shadow))",
        }}
      >
        <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto pr-2">
          {messages.map((message) => (
            <HydroMessage key={message.order} message={message} />
          ))}
        </div>
        <HydroInputContainer onSend={sendMessage} />
      </div>
    </div>
  );
};
