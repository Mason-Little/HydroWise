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
  const { toolCall } = plan;
  if (!toolCall || toolCall.toolName !== "grounded-response") {
    return;
  }
  return await runGroundedChatTool(
    toolCall.args.retrievalQuery,
    setAssistantDraft,
  );
};
