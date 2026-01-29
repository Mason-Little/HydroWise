import { Input } from "@headlessui/react";

type Props = {
  onInput: (message: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
};

export const HydroInput = ({ onInput, onSend, disabled = false }: Props) => {
  return (
    <Input
      type="text"
      placeholder="Ask me anything..."
      className="input"
      disabled={disabled}
      onChange={(e) => onInput(e.target.value)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter") {
          onSend(e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}
    />
  );
};
