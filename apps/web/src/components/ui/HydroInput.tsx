import { TextField } from "@mui/material";
import type { ChangeEvent, KeyboardEvent } from "react";

type Props = {
  value: string;
  onInput: (message: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
};

export const HydroInput = ({
  value,
  onInput,
  onSend,
  disabled = false,
}: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInput(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    onSend(value);
  };

  return (
    <TextField
      fullWidth
      placeholder="Ask anything about your notes, courses, or docs"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      size="small"
    />
  );
};
