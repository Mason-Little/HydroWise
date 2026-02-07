import { useChat } from "@/hooks/query/chat.queries";
import { useChatStore } from "@/store/chatStore";
import { ChatHistoryButton } from "./sidebar/chat-history-button";

import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar";

export const SideBar = () => {
  const { chats, createChat, deleteChat } = useChat();
  const { setSelectedChatId } = useChatStore();

  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border/60">
      <SidebarHeader className="gap-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sidebar-foreground text-sm font-semibold tracking-tight">
              HydroWise
            </p>
            <p className="text-sidebar-foreground/60 text-xs">
              Study workspace
            </p>
          </div>
          <SidebarTrigger className="hidden md:inline-flex" />
        </div>
        <Button
          className="w-full"
          onClick={() => createChat(crypto.randomUUID())}
        >
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent chats</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1 px-2 pb-2">
            {chats.map((chat) => (
              <ChatHistoryButton
                key={chat.id}
                chatId={chat.id}
                chatName={chat.name}
                onSelect={(chatId) => setSelectedChatId(chatId)}
                onDelete={(chatId) => deleteChat(chatId)}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
