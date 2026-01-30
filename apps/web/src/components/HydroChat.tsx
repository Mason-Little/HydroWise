import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { Box, Chip, Paper, Stack } from "@mui/material";
import { HydroInputContainer } from "@/components/ui/HydroInputContainer";
import { HydroMessage } from "@/components/ui/HydroMessage";
import { useChat } from "@/hooks/useChat";
import { useWebLLMEngine } from "@/hooks/useInitEngine";

export const HydroChat = () => {
  const { history, submitMessage } = useChat();
  const { engineReady, loadProgress } = useWebLLMEngine();

  const handleSend = async (content: string) => {
    if (!engineReady) return;
    await submitMessage(content);
  };

  return (
    <Box>
      <Paper elevation={1}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Chip
            label={engineReady ? "Ready" : "Warming up"}
            color={engineReady ? "secondary" : "default"}
            variant={engineReady ? "filled" : "outlined"}
            size="small"
          />
        </Stack>

        <Stack spacing={2}>
          {history.map((entry: ChatCompletionMessageParam, index: number) => (
            <HydroMessage key={`${entry.role}-${index}`} message={entry} />
          ))}
        </Stack>
        <Box>
          <HydroInputContainer
            onSend={handleSend}
            disabled={!engineReady}
            loadingProgress={loadProgress}
          />
        </Box>
      </Paper>
    </Box>
  );
};
