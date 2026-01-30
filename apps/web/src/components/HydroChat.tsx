import type { Message } from "@hydrowise/entities";
import { Box, Chip, Paper, Stack } from "@mui/material";
import { HydroInputContainer } from "@/components/ui/HydroInputContainer";
import { HydroMessage } from "@/components/ui/HydroMessage";
import { useChat } from "@/hooks/useChat";
import { useWebLLMEngine } from "@/hooks/useInitEngine";
import { useChatStore } from "@/store/chatStore";
import { useHistoryStore } from "@/store/historyStore";

export const HydroChat = () => {
  const { getHistory } = useHistoryStore();
  const { submitMessage } = useChat();
  const { activeChatId } = useChatStore();
  const { engineReady, loadProgress } = useWebLLMEngine();
  const history = activeChatId ? getHistory(activeChatId) : [];

  const handleSend = async (content: string) => {
    if (!engineReady) return;
    await submitMessage(content);
  };

  return (
    <Box
      sx={{
        maxWidth: 840,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          p: { xs: 2, sm: 3 },
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Chip
            label={engineReady ? "Ready" : "Warming up"}
            color={engineReady ? "secondary" : "default"}
            variant={engineReady ? "filled" : "outlined"}
            size="small"
          />
        </Stack>

        <Stack
          spacing={1.5}
          sx={{
            overflowY: "auto",
            minHeight: 240,
            maxHeight: { xs: 360, sm: 420 },
            pr: 0.5,
          }}
        >
          {history.map((entry: Message, index: number) => (
            <HydroMessage key={`${entry.role}-${index}`} message={entry} />
          ))}
        </Stack>
        <Box sx={{ mt: 2 }}>
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
