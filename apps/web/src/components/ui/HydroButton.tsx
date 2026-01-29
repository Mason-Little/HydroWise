import { Button } from "@headlessui/react";
import { Send } from "lucide-react";

type Props = {
  onClick: () => void;
};

export const HydroButton = ({ onClick }: Props) => {
  return (
    <Button className="btn btn-primary" onClick={onClick}>
      <Send className="h-4 w-4" />
      Send
    </Button>
  );
};
