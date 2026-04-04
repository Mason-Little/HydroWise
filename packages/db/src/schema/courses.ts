import {
  type CourseDetails,
  type CourseTodoItem,
  createDefaultGradePlannerState,
  type GradePlannerState,
  type GradeRubricItem,
  type GradeScaleItem,
  type Policy,
  type ProfessorInformation,
  type TestDate,
} from "@hydrowise/entities";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseName: text("course_name").notNull(),
  courseCode: text("course_code").notNull(),
  gradeRubric: jsonb("grade_rubric")
    .$type<GradeRubricItem[]>()
    .notNull()
    .default([]),
  gradeScale: jsonb("grade_scale")
    .$type<GradeScaleItem[]>()
    .notNull()
    .default([]),
  gradePlannerState: jsonb("grade_planner_state")
    .$type<GradePlannerState>()
    .notNull()
    .default(createDefaultGradePlannerState()),
  testDates: jsonb("test_dates").$type<TestDate[]>().notNull().default([]),
  professorInformation: jsonb("professor_information")
    .$type<ProfessorInformation>()
    .notNull(),
  courseDetails: jsonb("course_details").$type<CourseDetails>().notNull(),
  policies: jsonb("policies").$type<Policy[]>().notNull().default([]),
  courseTodos: jsonb("course_todos")
    .$type<CourseTodoItem[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
