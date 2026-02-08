import { ChatBox } from "@/components/Features/Chat/ChatBox";
import { ContextBox } from "@/components/Features/Context/ContextBox";

type WorkspaceProps = {
  feature: "chat" | "context";
};

export const Workspace = ({ feature }: WorkspaceProps) => {
  switch (feature) {
    case "chat":
      return <ChatBox />;
    case "context":
      return <ContextBox />;
  }
};
