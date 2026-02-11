import type {
  Chapter,
  ChapterCreateInput,
  CreateChapterResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const chapterAPI = {
  getChaptersForCourse: (courseId: string) => {
    return client.get(`chapter/${courseId}`).json<Chapter[]>();
  },

  createChapter: (payload: ChapterCreateInput) => {
    return client
      .post(`chapter`, { json: payload })
      .json<CreateChapterResponse>();
  },
};
