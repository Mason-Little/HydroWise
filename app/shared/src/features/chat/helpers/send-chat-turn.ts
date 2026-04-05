import type { GroundedAssistantMessagePayload } from "@hydrowise/entities";
import { buildChatTurnInput } from "@/features/chat/helpers/build-chat-turn-input";
import { ensureThreadForSend } from "@/features/chat/helpers/ensure-thread-for-send";
import { persistChatMessage } from "@/features/chat/helpers/persist-chat-message";
import { requestChatOrchestratorPlan } from "@/features/chat/helpers/request-chat-orchestrator-plan";
import { runChatTool } from "@/features/chat/helpers/run-chat-tool";
import { syncThread } from "@/features/chat/helpers/sync-thread";

type SendChatTurnParams = {
  threadId: string | null;
  setThreadId: (id: string | null) => void;
  text: string;
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void;
};

export const sendChatTurn = async ({
  threadId,
  setThreadId,
  text,
  setAssistantDraft,
}: SendChatTurnParams) => {
  setAssistantDraft(null);

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

  await syncThread(activeThreadId, plan);

  const output = await runChatTool(plan, setAssistantDraft);

  if (output) {
    await persistChatMessage({
      threadId: activeThreadId,
      role: "assistant",
      payload: output,
    });
    setAssistantDraft(null);
  }

  return {
    threadId: activeThreadId,
    userMessage,
    plan,
  };
};
