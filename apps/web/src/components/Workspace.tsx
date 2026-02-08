import { ChatBox } from "@/components/Features/Chat/ChatBox";
import { DocumentBox } from "@/components/Features/Documents/DocumentBox";

type WorkspaceProps = {
  feature: "chat" | "documents";
};

export const Workspace = ({ feature }: WorkspaceProps) => {
  switch (feature) {
    case "chat":
      return <ChatBox />;
    case "documents":
      return <DocumentBox />;
  }
};
