import { LinearProgress, Stack, Typography } from "@mui/material";
import { Send, Upload } from "lucide-react";
import { useState } from "react";
import { UploadDocumentModel } from "@/components/UploadDocumentModel";
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
  const [open, setOpen] = useState(false);

  const handleSend = (content: string) => {
    setMessage("");
    onSend(content);
  };

  return (
    <>
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
          <HydroButton
            onClick={() => setOpen(true)}
            disabled={disabled}
            label="Upload"
            icon={<Upload size={16} />}
          />
          <HydroInput
            value={message}
            onInput={setMessage}
            onSend={handleSend}
            disabled={disabled}
          />
          <HydroButton
            onClick={() => handleSend(message)}
            disabled={disabled || !message}
            label="Send"
            icon={<Send size={16} />}
          />
        </Stack>
      </Stack>

      <UploadDocumentModel open={open} onClose={() => setOpen(false)} />
    </>
  );
};
