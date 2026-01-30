import { Box, Button, Stack } from "@mui/material";
import { Trash } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export const HydroSidebar = () => {
  const { chats, setActiveChatId, createChat, deleteChat } = useChatStore();
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
        <Button onClick={() => createChat()}>New Chat</Button>
        {chats.map((chat) => (
          <Box key={chat.id}>
            <button type="button" onClick={() => setActiveChatId(chat.id)}>
              {chat.name}
            </button>
            <Button
              startIcon={<Trash />}
              onClick={() => deleteChat(chat.id)}
            ></Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
