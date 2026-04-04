import { buildChatTurnInput } from "@/features/chat/helpers/build-chat-turn-input";
import { ensureThreadForSend } from "@/features/chat/helpers/ensure-thread-for-send";
import { persistChatMessage } from "@/features/chat/helpers/persist-chat-message";
import { requestChatOrchestratorPlan } from "@/features/chat/helpers/request-chat-orchestrator-plan";
import { runChatTool } from "@/features/chat/helpers/run-chat-tool";

type SendChatTurnParams = {
  threadId: string | null;
  setThreadId: (id: string | null) => void;
  text: string;
};

export const sendChatTurn = async ({
  threadId,
  setThreadId,
  text,
}: SendChatTurnParams) => {
  const ensured = await ensureThreadForSend(threadId);
  const activeThreadId = ensured.threadId;

  if (ensured.createdNewThread) {
    setThreadId(activeThreadId);
  }

  const userMessage = await persistChatMessage({
    threadId: activeThreadId,
    role: "user",
    payload: { kind: "user-text", text },
  });

  const plannerInput = await buildChatTurnInput({
    threadId: activeThreadId,
    text,
  });

  const plan = await requestChatOrchestratorPlan(plannerInput);
  const toolResult = await runChatTool(plan);

  return {
    threadId: activeThreadId,
    userMessage,
    plan,
    toolResult,
  };
};
