import { Input } from "@headlessui/react";

type Props = {
  onInput: (message: string) => void;
  onSend: (message: string) => void;
};

export const HydroInput = ({ onInput, onSend }: Props) => {
  return (
    <Input
      type="text"
      placeholder="Ask me anything..."
      className="input"
      onChange={(e) => onInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSend(e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}
    />
  );
};
