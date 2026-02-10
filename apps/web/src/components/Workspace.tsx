import { ChatBox } from "@/components/Features/Chat/ChatBox";
import { ContextBox } from "@/components/Features/Context/ContextBox";
import { QuizBox } from "@/components/Features/Quiz/QuizBox";

type WorkspaceProps = {
  feature: "chat" | "context" | "quiz";
};

export const Workspace = ({ feature }: WorkspaceProps) => {
  switch (feature) {
    case "chat":
      return <ChatBox />;
    case "context":
      return <ContextBox />;
    case "quiz":
      return <QuizBox />;
  }
};
