import type {
  CourseCreateInput,
  CreateCourseResponse,
  GetCourseResponse,
  GetCoursesResponse,
  NoContentResponse,
} from "@hydrowise/entities";
import { client } from "@/api/client";

export const courseAPI = {
  getCourse: (id: string) => {
    return client.get(`course/${id}`).json<GetCourseResponse>();
  },

  getCourses: () => {
    return client.get(`course`).json<GetCoursesResponse>();
  },

  createCourse: (payload: CourseCreateInput) => {
    return client
      .post(`course`, { json: payload })
      .json<CreateCourseResponse>();
  },

  deleteCourse: (id: string) => {
    return client
      .delete(`course/${id}`)
      .then((): NoContentResponse => undefined);
  },
};
