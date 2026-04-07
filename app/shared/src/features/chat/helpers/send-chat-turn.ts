import type { GroundedAssistantMessagePayload } from "@hydrowise/entities";
import { buildChatTurnInput } from "@/features/chat/helpers/build-chat-turn-input";
import { ensureThreadForSend } from "@/features/chat/helpers/ensure-thread-for-send";
import { persistChatMessage } from "@/features/chat/helpers/persist-chat-message";
import { requestChatOrchestratorPlan } from "@/features/chat/helpers/request-chat-orchestrator-plan";
import { runChatTool } from "@/features/chat/helpers/run-chat-tool";
import { syncThread } from "@/features/chat/helpers/sync-thread";

type SendChatTurnParams = {
  activeThreadId: string | null;
  setActiveThread: (threadId: string | null) => void;
  text: string;
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void;
};

export const sendChatTurn = async ({
  activeThreadId: currentThreadId,
  setActiveThread,
  text,
  setAssistantDraft,
}: SendChatTurnParams) => {
  setAssistantDraft(null);

  const { threadId, createdNewThread } =
    await ensureThreadForSend(currentThreadId);

  if (createdNewThread) {
    setActiveThread(threadId);
  }

  const plannerInput = await buildChatTurnInput({
    threadId,
    text,
  });

  await persistChatMessage({
    threadId,
    role: "user",
    payload: { kind: "user-text", text },
  });

  const plan = await requestChatOrchestratorPlan(plannerInput);

  await syncThread(threadId, plan);

  const assistantPayload = await runChatTool(plan, setAssistantDraft);

  if (assistantPayload) {
    await persistChatMessage({
      threadId,
      role: "assistant",
      payload: assistantPayload,
    });
    setAssistantDraft(null);
  }

  return { threadId };
};
