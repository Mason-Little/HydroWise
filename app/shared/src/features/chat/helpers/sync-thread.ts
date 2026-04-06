import { getQueries } from "@hydrowise/data";
import type { ChatOrchestratorOutput } from "@hydrowise/entities";

export const syncThread = async (
  threadId: string,
  plan: Pick<ChatOrchestratorOutput, "threadTitle" | "activeCourse">,
) => {
  if (plan.threadTitle == null && plan.activeCourse == null) {
    return;
  }

  const { patchChatThread } = await getQueries();
  const patch: { title?: string; courseId?: string } = {};

  if (plan.threadTitle != null) {
    patch.title = plan.threadTitle;
  }
  if (plan.activeCourse != null) {
    patch.courseId = plan.activeCourse;
  }

  await patchChatThread(threadId, patch);
};
