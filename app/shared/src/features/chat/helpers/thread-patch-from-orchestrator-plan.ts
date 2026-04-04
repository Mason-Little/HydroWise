import type { ChatOrchestratorOutput, PatchChatThreadInput } from "@hydrowise/entities";

export const threadPatchFromOrchestratorPlan = (
  plan: Pick<ChatOrchestratorOutput, "activeCourse" | "threadTitle">,
): PatchChatThreadInput | null => {
  const patch: PatchChatThreadInput = {};
  if (plan.threadTitle != null) patch.title = plan.threadTitle;
  if (plan.activeCourse != null) patch.courseId = plan.activeCourse;
  return Object.keys(patch).length > 0 ? patch : null;
};
