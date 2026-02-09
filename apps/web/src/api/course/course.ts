import type { Course, CourseCreateInput } from "@hydrowise/entities";
import type { APIResponse } from "@/api/client";
import { client } from "@/api/client";

export const courseAPI = {
  getCourse: (id: string) => {
    return client.get(`course/${id}`).json<APIResponse<Course>>();
  },

  getCourses: () => {
    return client.get(`course`).json<APIResponse<Course[]>>();
  },

  createCourse: (payload: CourseCreateInput) => {
    return client.post(`course`, { json: payload }).json<APIResponse<Course>>();
  },

  deleteCourse: (id: string) => {
    return client.delete(`course/${id}`).json<APIResponse<Course>>();
  },
};
