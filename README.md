# Stack

### Frontend

- **Framework**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Linting / Formatting**: Biome

---

### Backend

- **Runtime**: Node.js
- **API**: Hono
  - Single codebase
  - Runs in **web mode** or **desktop mode**

---

### Database (source of truth)

- **Web**: PostgreSQL
- **Desktop**: PGlite (embedded Postgres, local file)
- **ORM**: Drizzle
  - Relational + app data
  - Embeddings stored via pgvector

---

### Vector Store (derived data)

- **Embeddings (web + desktop)**: **pgvector** (Postgres extension)
  - Desktop: PGlite + pgvector extension
  - Web: Postgres + pgvector extension

---

### Inference

- **Web**: WebLLM (in-browser via @browser-ai/web-llm, Vercel AI SDK)
- **Desktop**: llama.cpp (local runner / sidecar via @ai-sdk/openai)

# Features:

all of these features should allow for "@"ing courses/documents/terms???

- Dashboard (Upload Docs, Manage Context, View Courses)
- Grounded Chat
- Quiz Generation
- Flashcard Deck Generation
- Voice to Note (.md)

### Performance Controls

- Allow users to dial how much performance of there computer they want to use (CPU/GPU)
- Find wattage Draw for the given thing they are doing. maybe a cool analytics page


# Business Logic

- Open Source
- Point users to download the desktop app for more performance + full privacy
- Explain Deeply what is going on when you run a LLM on your machine. Animation?
