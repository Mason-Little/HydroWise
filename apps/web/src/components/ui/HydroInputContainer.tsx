import { useState } from "react";
import { HydroButton } from "@/components/ui/HydroButton";
import { HydroInput } from "@/components/ui/HydroInput";

type Props = {
  onSend: (message: string) => void;
};

export const HydroInputContainer = ({ onSend }: Props) => {
  const [message, setMessage] = useState("");

  return (
    <div className="input-shell">
      <HydroInput onInput={setMessage} onSend={onSend} />
      <HydroButton onClick={() => onSend(message)} />
    </div>
  );
};
