import type { Message } from "@hydrowise/entities";
import { Box, Chip, Paper, Stack } from "@mui/material";
import { useMemo } from "react";
import { HydroInputContainer } from "@/components/ui/HydroInputContainer";
import { HydroMessage } from "@/components/ui/HydroMessage";
import { useChat } from "@/hooks/useChat";
import { useWebLLMEngine } from "@/hooks/useInitEngine";

export const HydroChat = () => {
  const { messages, submitMessage, isStreaming, streamingContent } = useChat();
  const { engineReady, loadProgress } = useWebLLMEngine();

  const displayMessages = useMemo(() => {
    const baseMessages = messages ?? [];
    if (!isStreaming || streamingContent === null) return baseMessages;
    return [...baseMessages, { role: "assistant", content: streamingContent }];
  }, [messages, isStreaming, streamingContent]);

  const handleSend = async (content: string) => {
    if (!engineReady) return;
    await submitMessage(content);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 840,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        minWidth: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          p: { xs: 2, sm: 3 },
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
          minHeight: 0,
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
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            pr: 0.5,
          }}
        >
          {displayMessages.map((entry: Message, index: number) => (
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
