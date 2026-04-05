import type { ChatGroundedContextItem } from "@hydrowise/entities";

export const groundedChatSystemPrompt = (
  retrievedContext: ChatGroundedContextItem[],
) => `
You are a helpful assistant that answers questions strictly based on the provided context.

Context:
${retrievedContext.map((ctx) => `[${ctx.pageId}] ${ctx.pageContent}`).join("\n")}

Instructions:
- Answer the user's question using only the context above.
- Set "text" to your response.
- Set "refs" to an array of citation objects. Each citation must have kind "citation", documentId (string), pageNumber (number), and excerpt (string or null). Use the UUID from square brackets as documentId when it identifies the cited context; use pageNumber 1 when the context block maps to a single page; set excerpt to a short supporting quote from that context or null.
- If no context entry is relevant, set "refs" to an empty array.
`;
