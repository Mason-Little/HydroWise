# AI Runtime Overview

This package is the single source of truth for all AI in HydroWise. It manages three types of models — language, embeddings, and vision (OCR) — across both the web and desktop platforms.

---

## The Models

### Language Model — Qwen 3.5
Used for anything that requires reading, reasoning, or generating text. Runs locally in the browser (ONNX) or via llama.cpp on desktop.

| Tier | Model | Size | Default? |
|---|---|---|---|
| Tiny | Qwen 3.5 0.8B | 0.5 GB | |
| Fast | Qwen 3.5 2B | 1.4 GB | |
| **Balanced** | **Qwen 3.5 4B** | **2.5 GB** | **✓** |
| High | Qwen 3.5 9B | 5.4 GB | |
| Max | Qwen 3.5 27B | 16 GB | |

The default is **Balanced** on both web and desktop. Users can upgrade or downgrade from the settings page.

---

### Embedding Model — BGE Small
Used to convert text into vectors for semantic search (RAG). There's only one embedding model — no tiers. Small and fast by design.

- **Model:** `bge-small-en-v1.5`
- **Size:** ~67 MB
- **Purpose:** Turning document chunks into searchable embeddings, and turning user queries into vectors to search against them

---

### Vision Model — LightOnOCR 1B *(coming soon)*
Used to convert page images into text. A dedicated OCR model — not Qwen. Runs as a separate pipeline from the language model.

- **Model:** `LightOnOCR-1B-1025`
- **Size:** ~0.8 GB
- **Purpose:** Page → Markdown. Everything downstream depends on this output.

---

## The Features

Here's every AI-powered feature in the app, what it does, and which model it uses.

---

### Feature 1 — Page to Markdown (OCR)
**Model:** Vision (LightOnOCR)

Takes a single page image (PNG, standardized size) and returns clean markdown text. No prompt — image only. This is the first step in ingesting any document. Everything downstream depends on its output.

```
Input:  PNG image of a page
Output: Markdown string
```

---

### Feature 2 — Document Classification
**Model:** Language

Looks at the first page of a document and decides: is this a syllabus or a regular course document?

```
Input:  Markdown text of the first page
Output: { "is_syllabus": true | false }
```

---

### Feature 3 — Syllabus Parsing
**Model:** Language

Extracts structured course info from a syllabus — course name, instructor, schedule, grading breakdown, etc. Runs once per page of the syllabus. Partial results get merged into one complete course object.

```
Input:  Markdown text of a single page + JSON schema template
Output: Partial JSON (whatever fields this page covers)
```

---

### Feature 4 — Page Idea Generation
**Model:** Language

Summarizes what a single page of a course document is about. Runs once per page and produces the "ideas" list used in Feature 5.

```
Input:  Markdown text of a single page
Output: { "page_number": 1, "idea": "The seven shared characteristics that define life..." }
```

---

### Feature 5 — Course / Chapter / Topic Assignment
**Model:** Language

Given all the page ideas from a document, figures out where it belongs in the user's course structure. Can assign to existing chapters/topics or create new ones.

```
Input:  Array of page ideas + map of existing courses, chapters, topics
Output: { "course_id": "...", "chapter": { ... }, "topic": { ... } }
```

> ⚠️ This is the call most likely to hit context window limits — it receives the full course structure as input.

---

### Feature 6 — Grounded Chat (RAG)
**Models:** Embeddings (search) + Language (generation)

Two-step process. First the user's query gets embedded and searched against stored chunk embeddings in the database. Then the matching chunks get fed into the language model along with the query to generate a grounded answer.

```
Input:  User query string
Step 1: Embed query → search chunk embeddings → retrieve top matches
Step 2: Feed chunks + query → language model → generate answer
Output: { "response": "...", "sources": [{ "chunk_id": "...", "text": "..." }] }
```

---

### Feature 7 — Quiz Skeleton Generation
**Model:** Language

Decides the structure of a quiz before writing any questions. Figures out which topics to cover and how many questions each topic should get, weighted by how much content covers it.

```
Input:  Page ideas + quiz scope (course / chapter / document) + quiz params (total questions, difficulty)
Output: { "sections": [{ "topic": "...", "num_questions": 5, "chunk_ids": ["..."] }] }
```

---

### Feature 8 — Quiz Question Generation
**Model:** Language

Generates the actual questions for one section of the quiz skeleton. Runs once per section, fed only the relevant chunks so the model stays grounded and doesn't exceed context limits.

```
Input:  Markdown of relevant chunks + topic name + num questions + difficulty
Output: { "questions": [{ "question": "...", "choices": [...], "correct_answer": "B", "explanation": "...", "source_chunk_id": "..." }] }
```

---

## First-Time Setup

Both the language model and the embedding model need to be downloaded before the app can function. On first launch, if either model is missing, the app shows a setup screen instead of auto-downloading in the background. The user kicks off the download explicitly.

The language model download is larger and tier-dependent. The embedding model is small and always the same.
