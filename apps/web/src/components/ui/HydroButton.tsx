import { Button } from "@mui/material";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  icon?: React.ReactNode;
};

export const HydroButton = ({
  onClick,
  disabled = false,
  label,
  icon,
}: Props) => {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
