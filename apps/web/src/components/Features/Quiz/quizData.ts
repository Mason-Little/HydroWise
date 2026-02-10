import type { QuizQuestion } from "@hydrowise/entities";

export const quizQuestions: QuizQuestion[] = [
  {
    type: "multipleChoice",
    question: "What percentage of Earth's water is freshwater?",
    options: ["About 3%", "About 12%", "About 25%", "About 40%"],
    answer: 0,
  },
  {
    type: "fillInTheBlank",
    segments: [
      { type: "question", content: "A leaking" },
      { type: "answer", content: "toilet" },
      { type: "question", content: "can waste over" },
      { type: "answer", content: "200" },
      { type: "question", content: "gallons per day." },
    ],
  },
  {
    type: "shortAnswer",
    question: "Name one easy way to reduce indoor water use.",
    answer: "Fix leaks",
  },
  {
    type: "bool",
    question: "Running a dishwasher only when full saves water.",
    answer: true,
  },
  {
    type: "multipleChoice",
    question: "Which fixture usually uses the most water indoors?",
    options: ["Toilets", "Kitchen sink", "Microwave", "Ceiling fan"],
    answer: 0,
  },
  {
    type: "bool",
    question: "Turning off the tap while brushing your teeth can save water.",
    answer: true,
  },
  {
    type: "shortAnswer",
    question: "What does H2O stand for?",
    answer: "Water",
  },
  {
    type: "multipleChoice",
    question: "What is a low-flow showerhead designed to do?",
    options: [
      "Use less water per minute",
      "Increase water pressure endlessly",
      "Heat water faster",
      "Filter salt from seawater",
    ],
    answer: 0,
  },
  {
    type: "fillInTheBlank",
    segments: [
      { type: "question", content: "Collecting" },
      { type: "answer", content: "rainwater" },
      { type: "question", content: "is one way to reduce" },
      { type: "answer", content: "outdoor" },
      { type: "question", content: "tap usage." },
    ],
  },
  {
    type: "multipleChoice",
    question: "Which habit is best for lawn watering?",
    options: [
      "Water early morning",
      "Water at noon",
      "Water during rain",
      "Water every hour",
    ],
    answer: 0,
  },
  {
    type: "bool",
    question: "A dripping faucet is usually too small to matter.",
    answer: false,
  },
  {
    type: "shortAnswer",
    question: "Name one appliance that should be run with full loads.",
    answer: "Washing machine",
  },
  {
    type: "multipleChoice",
    question: "What does xeriscaping help reduce?",
    options: [
      "Outdoor water demand",
      "Indoor lighting use",
      "Internet usage",
      "Paint consumption",
    ],
    answer: 0,
  },
  {
    type: "fillInTheBlank",
    segments: [
      { type: "question", content: "Shorter" },
      { type: "answer", content: "showers" },
      { type: "question", content: "can lower both" },
      { type: "answer", content: "water" },
      { type: "question", content: "and energy use." },
    ],
  },
  {
    type: "bool",
    question: "Mulch helps soil keep moisture longer.",
    answer: true,
  },
  {
    type: "shortAnswer",
    question: "What should you check first if your bill suddenly spikes?",
    answer: "Leaks",
  },
];
