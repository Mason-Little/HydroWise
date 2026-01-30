import { Button } from "@mui/material";
import { Send } from "lucide-react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export const HydroButton = ({
  onClick,
  disabled = false,
  label = "Send",
}: Props) => {
  return (
    <Button
      variant="contained"
      endIcon={<Send size={16} />}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
