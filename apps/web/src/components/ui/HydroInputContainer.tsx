import { useState } from "react";
import { HydroButton } from "@/components/ui/HydroButton";
import { HydroInput } from "@/components/ui/HydroInput";

type Props = {
  onSend: (message: string) => void;
};

export const HydroInputContainer = ({ onSend }: Props) => {
  const [message, setMessage] = useState("");

  return (
    <div
      className="flex items-center gap-3 rounded-full px-4 py-3 focus-within:ring-1 focus-within:ring-white/70 backdrop-blur-[14px]"
      style={{
        background:
          "linear-gradient(160deg, hsl(var(--glass-surface)), hsl(var(--glass-highlight)))",
        border: "1px solid hsl(var(--glass-border))",
        boxShadow:
          "inset 0 1px 2px hsl(var(--glass-highlight)), 0 8px 16px hsl(var(--glass-shadow))",
      }}
    >
      <HydroInput onInput={setMessage} onSend={onSend} />
      <HydroButton onClick={() => onSend(message)} />
    </div>
  );
};
