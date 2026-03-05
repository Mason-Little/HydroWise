import type {
  GradeRubricItem,
  ProfessorInformation,
  TestDate,
} from "@hydrowise/entities";
import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseName: text("course_name").notNull(),
  courseCode: text("course_code").notNull(),
  gradeRubric: jsonb("grade_rubric").$type<GradeRubricItem[]>().notNull(),
  testDates: jsonb("test_dates").$type<TestDate[]>().notNull(),
  professorInformation: jsonb("professor_information")
    .$type<ProfessorInformation>()
    .notNull(),
});
