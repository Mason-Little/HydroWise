import type {
  Course,
  CourseCreateInput,
  CreateCourseResponse,
  GetCoursesResponse,
} from "@hydrowise/entities";
import type { APIResponse } from "@/api/client";
import { client } from "@/api/client";

export const courseAPI = {
  getCourse: (id: string) => {
    return client.get(`course/${id}`).json<APIResponse<Course>>();
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
    return client.delete(`course/${id}`).json<APIResponse<Course>>();
  },
};
