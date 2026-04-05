import type { ChatGroundedContextItem } from "@hydrowise/entities";

const contextBlockText = (items: ChatGroundedContextItem[]) =>
  items.map((ctx) => `[${ctx.pageId}] ${ctx.pageContent}`).join("\n");

export const groundedChatSystemPrompt = (
  retrievedContext: ChatGroundedContextItem[],
) => `
You are a helpful assistant that answers questions strictly based on the provided context.

Context:
${contextBlockText(retrievedContext)}

Instructions:
- Answer the user's question using only the context above.
- Your JSON must use kind "grounded-answer" on the root object, with "text" as your response.
- Set "refs" to an array of citation objects. Each citation must have kind "citation", pageId (string UUID), and excerpt (string or null). Use the same UUID that appears in square brackets before each context block as pageId when that block supports your answer; set excerpt to a short supporting quote from that context or null.
- If no context entry is relevant, set "refs" to an empty array.
`;
