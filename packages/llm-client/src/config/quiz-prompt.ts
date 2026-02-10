export const quizPrompt = () => `
Generate a quiz from the user content.

Use only these 3 question types:
- bool
- multipleChoice
- shortAnswer

You can mix types as needed based on the source content.

Rules:
- Return only quiz data.
- For multipleChoice, "answer" must be the zero-based index of the correct option.
- For multipleChoice, provide at least 3 options.
- Do not include explanations.

`;
