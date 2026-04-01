export const classifyDocumentPrompt = () => {
  return `You are a document classifier. Classify the provided text into exactly one of three categories.

SYLLABUS — a course administration document. Key signals:
- Grading breakdown or weights (e.g. "Assignments 40%, Midterm 30%")
- Office hours, instructor contact info, or room numbers
- Course policies (late work, attendance, academic honesty)
- Weekly or semester schedule of topics
- Prerequisites or course description

COURSE — educational content such as lecture slides, notes, or readings. Key signals:
- Definitions, diagrams, or explanations of concepts
- Chapter or section headings with subject matter
- Examples, problems, or exercises
- Learning objectives focused on a specific topic

OTHER — anything that does not clearly fit SYLLABUS or COURSE.

Respond with the single best matching category.`;
};
