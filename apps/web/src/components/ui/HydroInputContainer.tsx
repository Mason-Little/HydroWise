import { LinearProgress, Stack, Typography } from "@mui/material";
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

  const handleSend = (content: string) => {
    setMessage("");
    onSend(content);
  };

  return (
    <Stack spacing={1.5}>
      {loadingProgress < 100 && (
        <Stack direction="row" spacing={2} alignItems="center">
          <LinearProgress variant="determinate" value={loadingProgress} />
          <Typography variant="caption" color="text.secondary">
            Loading model {loadingProgress}%
          </Typography>
        </Stack>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <HydroInput
          value={message}
          onInput={setMessage}
          onSend={handleSend}
          disabled={disabled}
        />
        <HydroButton
          onClick={() => handleSend(message)}
          disabled={disabled || !message}
        />
      </Stack>
    </Stack>
  );
};
