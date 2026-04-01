import { z } from "zod";

export const PageSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  pageAbstract: z.string(),
  pageContent: z.string(),
  pageImage: z.instanceof(Uint8Array),
  pageEmbedding: z.array(z.number()),
});

export const CreatePageInputSchema = PageSchema.pick({
  documentId: true,
  pageAbstract: true,
  pageContent: true,
  pageImage: true,
  pageEmbedding: true,
});

export type Page = z.infer<typeof PageSchema>;
export type CreatePageInput = z.infer<typeof CreatePageInputSchema>;
