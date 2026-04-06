import { embedText, sendGroundedChat } from "@hydrowise/ai-runtime";
import { getQueries } from "@hydrowise/data";
import {
  type ChatOrchestratorOutput,
  type GroundedAssistantMessagePayload,
  GroundedAssistantMessagePayloadSchema,
} from "@hydrowise/entities";

const runGroundedChatTool = async (
  retrievalQuery: string,
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void,
) => {
  const embedding = await embedText(retrievalQuery);
  const { searchPages } = await getQueries();
  const retrievedContext = await searchPages(embedding);
  const { partialOutputStream, output } = sendGroundedChat({
    query: retrievalQuery,
    retrievedContext,
  });
  for await (const chunk of partialOutputStream) {
    const parsed = GroundedAssistantMessagePayloadSchema.safeParse(chunk);
    if (!parsed.success) {
      continue;
    }

    setAssistantDraft(parsed.data);
  }
  return output;
};

export const runChatTool = async (
  plan: ChatOrchestratorOutput,
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void,
) => {
  const call = plan.toolCall;
  if (call?.toolName !== "grounded-response") {
    return;
  }
  return runGroundedChatTool(call.args.retrievalQuery, setAssistantDraft);
};
