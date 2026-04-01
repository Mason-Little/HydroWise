import { z } from "zod";

const GRADE_RUBRIC_BUCKET_KINDS = [
  "assignment",
  "exam",
  "final_exam",
  "lab",
  "midterm_exam",
  "other",
  "paper",
  "participation",
  "presentation",
  "project",
  "quiz",
] as const;

export const GradeRubricBucketKindSchema = z.enum(GRADE_RUBRIC_BUCKET_KINDS);

export const GradeRubricItemSchema = z.object({
  assessmentCount: z.number(),
  bucketKind: GradeRubricBucketKindSchema.optional(),
  category: z.string(),
  weight: z.number(),
});

export const GradeScaleItemSchema = z.object({
  letter: z.string(),
  min: z.number().int(),
});

export const TestDateSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export const PolicySchema = z.object({
  label: z.string(),
  summary: z.string(),
});

export const ProfessorInformationSchema = z.object({
  professorName: z.string(),
  professorEmail: z.string(),
  professorOffice: z.string().nullable(),
  professorOfficeHours: z.string().nullable(),
});

export const CourseDetailsSchema = z.object({
  term: z.string().nullable(),
  schedule: z.string().nullable(),
  prerequisites: z.string().nullable(),
  textbook: z.string().nullable(),
  credits: z.number().int(),
});

export const GradePlannerStateSchema = z.object({
  selectedGoalLetter: z.string().nullable(),
  scoresByRubricIndex: z
    .record(z.string(), z.array(z.number().min(0).max(100)))
    .default({}),
});

export const createDefaultGradePlannerState = (): z.infer<
  typeof GradePlannerStateSchema
> => ({
  selectedGoalLetter: null,
  scoresByRubricIndex: {},
});

export const CourseTodoItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
  /** ISO date string; optional — shown as compact “Due …” when set. */
  dueAt: z.string().nullable().optional(),
});

export const CourseSchema = z.object({
  id: z.string(),
  courseName: z.string().min(1),
  courseCode: z.string().min(1),
  gradeRubric: z.array(GradeRubricItemSchema),
  gradeScale: z.array(GradeScaleItemSchema),
  gradePlannerState: GradePlannerStateSchema.default(
    createDefaultGradePlannerState,
  ),
  testDates: z.array(TestDateSchema),
  professorInformation: ProfessorInformationSchema,
  courseDetails: CourseDetailsSchema,
  policies: z.array(PolicySchema),
  courseTodos: z.array(CourseTodoItemSchema).default([]),
});

export const CreateCourseInputSchema = CourseSchema.omit({ id: true });

export type CourseDetails = z.infer<typeof CourseDetailsSchema>;
export type CourseDetailsPatch = Partial<CourseDetails>;

export type GradePlannerState = z.infer<typeof GradePlannerStateSchema>;
export type GradeRubricBucketKind = z.infer<typeof GradeRubricBucketKindSchema>;
export type GradeRubricItem = z.infer<typeof GradeRubricItemSchema>;
export type GradeScaleItem = z.infer<typeof GradeScaleItemSchema>;
export type TestDate = z.infer<typeof TestDateSchema>;
export type Policy = z.infer<typeof PolicySchema>;
export type ProfessorInformation = z.infer<typeof ProfessorInformationSchema>;
export type CourseTodoItem = z.infer<typeof CourseTodoItemSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type CreateCourseInput = z.input<typeof CreateCourseInputSchema>;
