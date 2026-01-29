import { useState } from "react";
import { HydroButton } from "@/components/ui/HydroButton";
import { HydroInput } from "@/components/ui/HydroInput";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
  loadingProgress?: number;
};

export const HydroInputContainer = ({
  onSend,
  disabled = false,
  loadingProgress = 0,
}: Props) => {
  const [message, setMessage] = useState("");

  return (
    <div className="input-shell">
      <HydroInput onInput={setMessage} onSend={onSend} disabled={disabled} />
      {loadingProgress < 100 ? (
        <div className="btn btn-primary pointer-events-none">
          Loading {loadingProgress}%
        </div>
      ) : (
        <HydroButton onClick={() => onSend(message)} disabled={disabled} />
      )}
    </div>
  );
};
