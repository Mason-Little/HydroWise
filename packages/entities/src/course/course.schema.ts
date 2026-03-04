import { z } from "zod";

const GradeRubricItemSchema = z.object({
  category: z.string(),
  weight: z.number(),
});

const TestDateSchema = z.object({
  name: z.string(),
  date: z.string(),
});

const ProfessorInformationSchema = z.object({
  professorName: z.string(),
  professorEmail: z.string(),
  professorOfficeHours: z.string(),
  professorOfficeDays: z.string(),
});

export const CourseSchema = z.object({
  id: z.string().min(1),
  courseName: z.string(),
  courseCode: z.string(),
  gradeRubric: z.array(GradeRubricItemSchema),
  testDates: z.array(TestDateSchema),
  professorInformation: ProfessorInformationSchema,
});

export type Course = z.infer<typeof CourseSchema>;
