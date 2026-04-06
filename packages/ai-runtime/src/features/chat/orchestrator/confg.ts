import type { ChatOrchestratorInput } from "@hydrowise/entities";

export const orchestratorSystemPrompt = `You are HydroWise's chat orchestrator. Each turn, choose toolCall first.

toolCall: e.g. grounded-response with userQuery and retrievalQuery; retrievalQuery should suit semantic search.

Top-level activeCourse and threadTitle (thread metadata, not tool args): optional—omit them when nothing should change. If context already shows title and course are set and still correct, leave them out (do not restate). Set or change only when needed: first clear assignment, course switch, wrong/missing course for the question, tool choice requires it, or a clear topic shift for the title. When you set activeCourse, use a workspace course id exactly.

Opening turn (no assistant messages yet): set course and a short title (2–6 words, student-facing) when the message is specific enough; otherwise omit both.`;

export const buildOrchestratorUserPrompt = (input: ChatOrchestratorInput) =>
  `Context (JSON):\n${JSON.stringify({
    recentMessages: input.recentMessages,
    workspaceContext: input.workspaceContext,
  })}\n\nUser message:\n${input.userMessage}`;
