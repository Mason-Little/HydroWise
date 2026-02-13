import { z } from "zod";
import { ChapterSchema } from "./chapter.schema";

export const GetChaptersResponseSchema = z.array(ChapterSchema);

export type GetChaptersResponse = z.infer<typeof GetChaptersResponseSchema>;

export const GetChapterResponseSchema = ChapterSchema;

export type GetChapterResponse = z.infer<typeof GetChapterResponseSchema>;

export const CreateChapterResponseSchema = ChapterSchema;

export type CreateChapterResponse = z.infer<typeof CreateChapterResponseSchema>;
