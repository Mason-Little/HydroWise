import z from "zod";

export const pageAbstractsPrompt = `
You are a page abstract generator.

Generate a 1–2 sentence abstract for each page you receive.
`.trim();

export const pageAbstractsSchema = z.object({
  pages: z.array(
    z.object({
      pageNumber: z.number(),
      abstract: z.string(),
    }),
  ),
});
