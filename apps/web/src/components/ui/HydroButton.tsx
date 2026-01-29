import { Button } from "@headlessui/react";
import { Send } from "lucide-react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export const HydroButton = ({ onClick, disabled = false }: Props) => {
  return (
    <Button className="btn btn-primary" onClick={onClick} disabled={disabled}>
      <Send className="h-4 w-4" />
      Send
    </Button>
  );
};
