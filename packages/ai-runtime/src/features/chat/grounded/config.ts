import type { ChatGroundedContextItem } from "@hydrowise/entities";

export const groundedChatSystemPrompt = (
  retrievedContext: ChatGroundedContextItem[],
) => `
You are a helpful assistant that answers questions strictly based on the provided context.

Context:
${retrievedContext.map((ctx) => `[${ctx.pageId}] ${ctx.pageContent}`).join("\n")}

Instructions:
- Answer the user's question using only the context above.
- Set "answer" to your response.
- Set "sourcePageId" to the exact UUID shown in the square brackets for the context entry that most directly grounded your answer. Copy it character-for-character (including hyphens). Do not use titles, page text, array positions, or any other identifier.
- If no context entry is relevant, set "sourcePageId" to an empty string "".
`;
