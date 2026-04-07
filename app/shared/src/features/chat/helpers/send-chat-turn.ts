import type {
  ChatMessage,
  ChatOrchestratorOutput,
  GroundedAssistantMessagePayload,
} from "@hydrowise/entities";
import { buildChatTurnInput } from "@/features/chat/helpers/build-chat-turn-input";
import { persistChatMessage } from "@/features/chat/helpers/persist-chat-message";
import { requestChatOrchestratorPlan } from "@/features/chat/helpers/request-chat-orchestrator-plan";
import { runChatTool } from "@/features/chat/helpers/run-chat-tool";
import { syncThread } from "@/features/chat/helpers/sync-thread";

type SendChatTurnParams = {
  threadId: string;
  text: string;
  onAssistantChunk: (draft: GroundedAssistantMessagePayload) => void;
  onUserPersisted: (message: ChatMessage) => void;
  onThreadSynced: (
    plan: Pick<ChatOrchestratorOutput, "threadTitle" | "activeCourse">,
  ) => void;
  onAssistantPersisted: (message: ChatMessage) => void;
};

export const sendChatTurn = async ({
  threadId,
  text,
  onAssistantChunk,
  onUserPersisted,
  onThreadSynced,
  onAssistantPersisted,
}: SendChatTurnParams) => {
  const plannerInput = await buildChatTurnInput({
    threadId,
    text,
  });

  const persistedUser = await persistChatMessage({
    threadId,
    role: "user",
    payload: { kind: "user-text", text },
  });
  onUserPersisted(persistedUser);

  const plan = await requestChatOrchestratorPlan(plannerInput);

  await syncThread(threadId, plan);
  onThreadSynced(plan);

  const assistantPayload = await runChatTool(plan, onAssistantChunk);

  if (assistantPayload) {
    const persistedAssistant = await persistChatMessage({
      threadId,
      role: "assistant",
      payload: assistantPayload,
    });
    onAssistantPersisted(persistedAssistant);
    return { threadId, hadAssistant: true };
  }

  return { threadId, hadAssistant: false };
};
