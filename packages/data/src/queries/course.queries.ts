import type { Db } from "@hydrowise/db";
import { courses } from "@hydrowise/db/schema";
import {
  type CourseDetails,
  CourseDetailsSchema,
  type CreateCourseInput,
  CreateCourseInputSchema,
  type GradePlannerState,
  GradePlannerStateSchema,
  type ProfessorInformation,
  ProfessorInformationSchema,
} from "@hydrowise/entities";
import { eq } from "drizzle-orm";

export const makeCourseRepo = (db: Db) => {
  const getCourseOrThrow = async (courseId: string) => {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    if (!course) throw new Error(`Course not found: ${courseId}`);
    return course;
  };

  return {
    listCourses: async () => {
      return db.select().from(courses);
    },

    createCourse: async (input: CreateCourseInput) => {
      const courseInput = CreateCourseInputSchema.parse(input);
      const [row] = await db.insert(courses).values(courseInput).returning();
      return row;
    },

    updateProfessorInformation: async (
      courseId: string,
      patch: Partial<ProfessorInformation>,
    ) => {
      const existing = await getCourseOrThrow(courseId);
      const updated = ProfessorInformationSchema.parse({
        ...existing.professorInformation,
        ...patch,
      });
      const [row] = await db
        .update(courses)
        .set({ professorInformation: updated })
        .where(eq(courses.id, courseId))
        .returning();
      return row;
    },

    updateCourseDetails: async (
      courseId: string,
      patch: Partial<CourseDetails>,
    ) => {
      const existing = await getCourseOrThrow(courseId);
      const updated = CourseDetailsSchema.parse({
        ...existing.courseDetails,
        ...patch,
      });
      const [row] = await db
        .update(courses)
        .set({ courseDetails: updated })
        .where(eq(courses.id, courseId))
        .returning();
      return row;
    },

    updateGradePlannerState: async (
      courseId: string,
      plannerState: GradePlannerState,
    ) => {
      await getCourseOrThrow(courseId);

      const nextPlannerState = GradePlannerStateSchema.parse(plannerState);
      const [row] = await db
        .update(courses)
        .set({ gradePlannerState: nextPlannerState })
        .where(eq(courses.id, courseId))
        .returning();
      return row;
    },
  };
};
