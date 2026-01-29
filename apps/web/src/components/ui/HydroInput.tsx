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
      className="w-full bg-transparent px-2 py-1 text-[0.95rem] text-slate-800 placeholder:text-slate-500 focus:outline-none"
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
