import { Button } from "@headlessui/react";
import { Send } from "lucide-react";

type Props = {
  onClick: () => void;
};

export const HydroButton = ({ onClick }: Props) => {
  return (
    <Button
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-800 shadow-[0_8px_18px_hsl(var(--glass-shadow))] transition duration-200 hover:bg-[hsl(var(--ui-gray-strong))] hover:shadow-[0_12px_24px_hsl(var(--glass-shadow))] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      onClick={onClick}
      style={{ backgroundColor: "hsl(var(--ui-gray))" }}
    >
      <Send className="h-4 w-4" />
      Send
    </Button>
  );
};
