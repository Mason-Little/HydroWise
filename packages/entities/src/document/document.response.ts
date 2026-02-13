import { z } from "zod";
import { DocumentSchema } from "./document.schema";

export const GetDocumentsResponseSchema = z.array(DocumentSchema);

export type GetDocumentsResponse = z.infer<typeof GetDocumentsResponseSchema>;

export const CreateDocumentResponseSchema = DocumentSchema;

export type CreateDocumentResponse = z.infer<
  typeof CreateDocumentResponseSchema
>;
