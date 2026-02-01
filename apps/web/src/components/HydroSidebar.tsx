import type { Chat } from "@hydrowise/entities";
import { Box, Button, Stack } from "@mui/material";
import { Trash } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/store/chatStore";

export const HydroSidebar = () => {
  const { chats, createChatMutation, deleteChatMutation } = useChat();
  const { setActiveChatId } = useChatStore();
  return (
    <Box
      sx={{
        width: 256,
        height: "100vh",
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack>
        <Button onClick={() => createChatMutation.mutate()}>New Chat</Button>
        {chats?.map((chat: Chat) => (
          <Box key={chat.id}>
            <button type="button" onClick={() => setActiveChatId(chat.id)}>
              {chat.name}
            </button>
            <Button
              startIcon={<Trash />}
              onClick={() => deleteChatMutation.mutate(chat.id)}
            ></Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
