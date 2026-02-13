import { z } from "zod";
import { TopicSchema } from "./topic.schema";

export const GetTopicsResponseSchema = z.array(TopicSchema);

export type GetTopicsResponse = z.infer<typeof GetTopicsResponseSchema>;
