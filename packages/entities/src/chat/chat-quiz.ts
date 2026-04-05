import { z } from "zod";

import { ChatArtifactRefSchema } from "./chat-refs";

export const QuizAssistantMessagePayloadSchema = z.object({
  kind: z.literal("artifact-created"),
  text: z.string(),
  refs: z.array(ChatArtifactRefSchema),
});

export type QuizAssistantMessagePayload = z.infer<
  typeof QuizAssistantMessagePayloadSchema
>;
