import { z } from "zod";
import { ContextSchema } from "./context.schema";

export const GetContextResponseSchema = z.array(ContextSchema);

export type GetContextResponse = z.infer<typeof GetContextResponseSchema>;
