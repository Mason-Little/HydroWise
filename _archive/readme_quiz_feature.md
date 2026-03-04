# North Star: Topic-Driven Quiz Generation (Desktop-first, Web-later)

This document defines the “topic-first” pipeline for generating chapter / multi-chapter / full-course quizzes from uploaded course materials. It focuses on **practical implementation with your current schema** (documents + chunk embeddings) while adding the minimum new structure needed to make quiz generation **high quality, controllable, and non-wasteful**.

---

## Goals

### Product goals

- Users upload notes/slides/docs → app builds a structured study view.
- Generate quizzes for:
  - **Single chapter**
  - **Selected chapters**
  - **Full course / final**
- Quizzes must include a **controlled mix** of:
  - Boolean (True/False)
  - Multiple choice
  - Short answer
- Avoid repetitive / duplicate questions.
- Provide strong UI affordances:
  - browse chapter by topic
  - show coverage / weight
  - generate quizzes “by topic” or “balanced”

### Engineering constraints

- Desktop-first: tokens are less of a concern, but latency and pipeline reliability still matter.
- Web-later: smaller context windows → need a plan that degrades gracefully.
- Keep LLM inputs/outputs **small** whenever possible.
- Use embeddings for retrieval, but don’t require embeddings for *every* decision.

---

## Core idea

**Separate “topic creation” from “topic assignment”.**
- **Topic creation** happens at the **chapter level** (rare, stable).
- **Topic assignment** happens for **chunks** (cheap, repeatable), choosing from existing topics.

Then quiz generation becomes:
1. plan quiz structure using **topic summaries + counts** (lightweight)
2. retrieve a few best chunks per topic using embeddings (targeted)
3. generate questions per topic section (bounded compute)
4. final dedupe + fill missing slots (small retries)

---

## Data model (current + additions)

### Existing tables (you have)

- `courses` (chapters stored in JSONB)
- `documents` (linked to courseId + chapterId)
- `document_embeddings` (chunks with `content` + `embedding` + `chunkIndex`)

### Additions (minimum recommended)

1) `chapter_topics` (topics are first-class)

Topics belong to a course + chapter and are stable identifiers used everywhere else.

columntypenotesidtext (uuid)primary keyuserIdtextowner (optional but helpful)courseIdtextFK to courseschapterIdtextmatches your `documents.chapterId`nametext“Properties of Water”descriptiontextshort definition (optional but useful)orderintegeroptional UI orderingcreatedAttimestamp

**Why separate table?** Topics are used across many docs/chunks and you’ll want UI + analytics on them.

2) `document_chunk_meta` (store the “chunk idea”)

You currently store chunk content+embedding in `document_embeddings`. Add a small meta table keyed by `(documentId, chunkIndex)` or add columns to `document_embeddings`.

Option A (recommended): add columns to `document_embeddings`
- `chunkIdea` (text) — 1–2 lines: “Explains pH scale and buffers”
- `topicId` (text) — the dominant topic for the chunk
- `topicConfidence` (integer or real) — optional

Option B: keep embeddings table pure and add a meta table:
`document_chunk_meta(documentId, chunkIndex, chunkIdea, topicId, topicConfidence)`

**Why store chunk idea?**
- Lets the planner operate on **topic → ideas** without raw content.
- Great for UI and debugging.
- Helps small models a lot.

3) (Optional) allow multi-topic chunks

If you want up to 2 topics per chunk later, add a join table:

`chunk_topics(documentId, chunkIndex, topicId, confidence)`

Start with **single dominant topic** per chunk. Add multi-topic only if needed.

---

## Example dataset (Bio 101, Chapter 2)

Assume course: **Bio 101**
Chapter: **Chemistry of Life**
Documents: 6
Chunks: ~16 total

### `chapter_topics`

idcourseIdchapterIdnamedescriptiont1bio101ch2Atomic Structure & BondsAtoms, electrons, ionic/covalent/hydrogen bondst2bio101ch2Properties of WaterPolarity, cohesion/adhesion, temperature bufferingt3bio101ch2Acids, Bases, and pHpH scale, buffers, biological relevancet4bio101ch2Biological MacromoleculesCarbs, lipids, proteins, nucleic acids

### `documents`

idcourseIdchapterIdnamemimeTyped1bio101ch2Lecture 2 Slidesapplication/pdfd2bio101ch2Lecture 2 Notestext/markdownd3bio101ch2Textbook Chapter 2application/pdfd4bio101ch2Macromolecules Worksheetapplication/pdfd5bio101ch2Lab: Water & pHapplication/pdfd6bio101ch2Chapter 2 Summarytext/markdown

### `document_embeddings` (conceptual view)

documentIdchunkIndexchunkIdeatopicIdd10Explains atoms, electrons, and bond typest1d11Describes hydrogen bonds and water polarityt2d20Compares covalent vs ionic bondst1d21Introduces pH scale and bufferst3d32Overview of carbohydrates and lipidst4d33Proteins and nucleic acids structuret4d50pH measurement and buffer behavior in labt3d60Summary of water properties and why they mattert2

(Each row also includes `content` + `embedding` already.)

---

## Ingestion pipeline (upload → topics → chunk assignment)

### Step 0: user uploads document

- User selects `courseId` and `chapterId` during upload.
- Convert to markdown.
- Chunk markdown (target: ~4k chars / ~1k tokens).

### Step 1: embedding + chunk idea (per chunk)

For each chunk:
- generate embedding (768)
- generate **chunkIdea** (1–2 lines)

**Chunk idea is not a question.** It’s a semantic label.

### Step 2: ensure chapter topics exist

If it’s the first document for the chapter, create initial topic set.

**Inputs**
- course name + chapter title
- document name
- list of chunkIdeas (not full content)
- existing topics (none for first doc)

**Outputs**
- a small stable list of topics (6–12 max for a chapter)
- topic descriptions optional

### Step 3: assign a topic to each chunk

Given the chapter topic list:
- choose dominant topic for each chunk (plus optional confidence)
- store topicId on the chunk (or in join table)

### Background processing rules (desktop-first)

- All these steps can run “in the background”.
- Quizzes can prefer “only fully indexed chunks” if indexing isn’t finished.

---

## Quiz generation pipeline

### Key design principle

**Plan using topic summaries; generate using chunk retrieval.**

Inputs available (cheap)

For the selected scope, build:
- list of topics
- for each topic:
  - count of documents
  - count of chunks
  - list of chunkIdeas (maybe capped to N)
  - optional “importance” hint (user selection, chapter order, etc.)

When you use embeddings (expensive-ish)

Only when you need to pull actual evidence text for question generation.

---

## Quiz Conductor (planner) API

The quiz conductor creates a **quiz plan** (skeleton), not the final questions.

### `quizConductor` input (chapter quiz)

```
{
  "scope": {
    "courseId": "bio101",
    "chapterId": "ch2"
  },
  "questionCount": 16,
  "mix": { "mcq": 0.5, "bool": 0.25, "short": 0.25 },
  "topicStats": [
    {
      "topicId": "t1",
      "name": "Atomic Structure & Bonds",
      "docCount": 3,
      "chunkCount": 6,
      "chunkIdeas": [
        "Atoms/electrons and bond types",
        "Covalent vs ionic bonds",
        "Hydrogen bonds intro"
      ]
    },
    {
      "topicId": "t2",
      "name": "Properties of Water",
      "docCount": 2,
      "chunkCount": 4,
      "chunkIdeas": ["Water polarity", "Cohesion/adhesion", "Temperature buffering"]
    },
    {
      "topicId": "t3",
      "name": "Acids, Bases, and pH",
      "docCount": 2,
      "chunkCount": 3,
      "chunkIdeas": ["pH scale", "Buffers in biology", "Lab measurement notes"]
    },
    {
      "topicId": "t4",
      "name": "Biological Macromolecules",
      "docCount": 4,
      "chunkCount": 7,
      "chunkIdeas": ["Carbs vs lipids", "Protein structure", "DNA/RNA basics"]
    }
  ],
  "constraints": {
    "avoidDuplicateConcepts": true,
    "requireCitations": true
  }
}
```

### `quizConductor` output (plan only)

```
{
  "quizPlan": [
    { "topicId": "t1", "counts": { "mcq": 3, "bool": 1, "short": 1 } },
    { "topicId": "t2", "counts": { "mcq": 2, "bool": 1, "short": 1 } },
    { "topicId": "t3", "counts": { "mcq": 2, "bool": 1, "short": 1 } },
    { "topicId": "t4", "counts": { "mcq": 3, "bool": 1, "short": 1 } }
  ],
  "globalMix": { "mcq": 8, "bool": 4, "short": 4 },
  "notes": {
    "weighting": "Allocated more to macromolecules based on chunk/doc prevalence"
  }
}
```

---

## Per-topic section generation (bounded)

For each plan item:
1. retrieve top chunks for that topic
2. generate exactly N questions of each type
3. include citations to chunk source

### Retrieval input

- `topicId`
- desired chunk budget (e.g., 8 chunks)
- optional difficulty or focus

### Retrieval output

A curated list of chunk references:
- `documentId`, `chunkIndex`, `content`, `chunkIdea`

### `generateTopicSection` input example

```
{
  "topic": {
    "topicId": "t2",
    "name": "Properties of Water"
  },
  "counts": { "mcq": 2, "bool": 1, "short": 1 },
  "chunks": [
    { "documentId": "d1", "chunkIndex": 1, "chunkIdea": "Water polarity", "content": "..." },
    { "documentId": "d6", "chunkIndex": 0, "chunkIdea": "Cohesion/adhesion", "content": "..." }
  ],
  "constraints": {
    "noTrickQuestions": true,
    "mustBeAnswerableFromChunks": true,
    "includeCitations": true
  }
}
```

### Output: questions with citations

```
{
  "topicId": "t2",
  "questions": [
    {
      "type": "mcq",
      "prompt": "Which property of water is primarily caused by its polarity?",
      "choices": ["High cohesion", "Low density of ice", "Ability to dissolve nonpolar molecules", "Inability to form hydrogen bonds"],
      "answer": "High cohesion",
      "citations": [{ "documentId": "d6", "chunkIndex": 0 }]
    },
    {
      "type": "bool",
      "prompt": "Hydrogen bonding is a major reason water has a high specific heat.",
      "answer": true,
      "citations": [{ "documentId": "d1", "chunkIndex": 1 }]
    },
    {
      "type": "short",
      "prompt": "Explain how cohesion and adhesion contribute to capillary action in plants.",
      "rubric": "Mentions cohesion between water molecules + adhesion to surfaces; explains upward movement.",
      "citations": [{ "documentId": "d6", "chunkIndex": 0 }]
    }
  ]
}
```

---

## Global dedupe + fill pass (cheap safety net)

After all topic sections are generated:
- embed question stems (small)
- detect near-duplicates
- remove duplicates
- re-generate only the missing slots for the affected topics

This keeps compute bounded and prevents “re-run entire quiz”.

---

## Chapter vs multi-chapter vs course-wide scope

Same pipeline; only the topic set changes.

### Chapter quiz

- topics: `chapter_topics where chapterId = X`
- weighting: by prevalence (doc/chunk counts) + optional user emphasis

### Multi-chapter quiz

- topics: union of selected chapter topics
- weighting: normalize per chapter so one chapter doesn’t dominate unless desired

### Full course / final exam

- topics: union of all chapters
- weighting: include chapter order, recentness, or user “importance”
- optionally allocate per chapter first, then within chapter per topic

---

## Practical “small model” reasoning

This approach works well with smaller local models because:
- chunkIdea generation is easy
- topic assignment is a constrained classification problem
- planning uses structured lists (topic → ideas + counts)
- generation is per-topic with limited chunk context

---

## UI wins (first-class topics)

With topics stored:
- Chapter view: topic list + counts + coverage
- Filter: show chunks/docs grouped by topic
- Quiz creation UI: choose topics, set weight/difficulty
- Progress: “You’ve studied 3/4 topics”

---

## Implementation checklist (high level)

### Phase 1 (minimum viable)

- Add `chapter_topics`
- Add `chunkIdea` + `topicId` to chunk storage
- Background job: create topics for first doc in chapter
- Background job: assign topic to each chunk
- QuizConductor plan + per-topic section generator
- Global dedupe + fill

### Phase 2 (polish)

- topic descriptions + user renaming
- multi-topic chunks (optional)
- per-topic difficulty targeting
- chapter table migration (optional later)

---

## Design “rules of thumb”

- Keep chapter topics small: **6–12** target
- Chunk topic assignment: **1 topic** default (allow 2 later)
- Chunk size: **~4k chars / ~1k tokens** is a good starting point
- Use embeddings for retrieval, not planning
- Always include chunk citations in generated questions

---

If you want, I can also paste a **single combined JSON example** that includes:
- topicStats
- quizPlan
- per-topic chunk retrieval results
- final quiz output format
  …so you can drop it into another context chat as a complete end-to-end “trace”.