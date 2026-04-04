import { getQueries } from "@hydrowise/data";
import type { ChatOrchestratorOutput } from "@hydrowise/entities";

export const syncThread = async (
  threadId: string,
  plan: Pick<ChatOrchestratorOutput, "threadTitle" | "activeCourse">,
) => {
  const patch: { title?: string; courseId?: string } = {};

  if (plan.threadTitle != null) patch.title = plan.threadTitle;
  if (plan.activeCourse != null) patch.courseId = plan.activeCourse;

  if (Object.keys(patch).length === 0) return;

  const { patchChatThread } = await getQueries();
  await patchChatThread(threadId, patch);
};
