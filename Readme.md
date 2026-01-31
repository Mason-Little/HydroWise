# Stack

### Frontend

- **Framework**: React (Vite) + TypeScript
- **Auth**: AuthJS (web) + cached session/token (desktop/offline)
- **Styling**: MUI
- **Linting / Formatting**: Biome

---

### Backend

- **Runtime**: Node.js
- **API**: Fastify
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

- **Web**: WebLLM (in-browser)
- **Desktop**: llama.cpp (local runner / sidecar)

# Features:

all of these features should allow for "@"ing courses/documents/terms???

- Standard chat with memory
- Flashcard generation
- Coursework quiz generation
- Notes assistant

### Gamification

- track the amount of wattage the computer is using and convert it to L/consumed
- compare to real world water usage ie. showers, baths, etc.

### Performance Controls

- Allow users to dial how much performance of there computer they want to use (CPU/GPU)
- Find wattage Draw for the given thing they are doing. maybe a cool analytics page


# Business Logic

- Open Source
- Point users to download the desktop app for more performance + full privacy
- Explain Deeply what is going on when you run a LLM on your machine. Animation?

# Models to use

## Web (wllama)

LLM

- Llama 3.1 8B Instruct (Q4_K_M)
- Qwen2.5 7B Instruct (Q4_K_M)

Embeddings

- nomic-embed-text-v1.5 (Q4_0)
- bge-small-en-v1.5 (Q4_0)

## Local (llama.cpp, Metal)

Mac M1

- LLM: Llama 3.1 8B Instruct (Q4_K_M) or Mistral 7B Instruct (Q4_K_M)
- Embeddings: nomic-embed-text-v1.5 (Q4_0)

Mac M2

- LLM: Qwen2.5 7B Instruct (Q4_K_M) or Llama 3.1 8B Instruct (Q4_K_M)
- Embeddings: bge-base-en-v1.5 (Q4_0) or nomic-embed-text-v1.5 (Q4_0)

Mac M3

- LLM: Qwen2.5 14B Instruct (Q4_K_M) or Llama 3.1 8B Instruct (Q4_K_M)
- Embeddings: bge-base-en-v1.5 (Q4_0) or nomic-embed-text-v1.5 (Q4_0)

Mac M4

- LLM: Qwen2.5 14B Instruct (Q4_K_M) or Llama 3.1 8B Instruct (Q4_K_M)
- Embeddings: bge-base-en-v1.5 (Q4_0) or nomic-embed-text-v1.5 (Q4_0)

# Tree

```
HydroWise/
├─ apps/
│  ├─ web/                              # React (Vite) UI (web + desktop webview)
│  │  ├─ src/
│  │  │  ├─ components/                 # chat UI, sidebar, inputs, modals
│  │  │  ├─ pages/                      # chat, courses, docs, notes, quizzes, analytics
│  │  │  ├─ hooks/                      # LLM init, chat orchestration
│  │  │  ├─ store/                      # Zustand stores (chat/history/etc)
│  │  │  ├─ theme.ts                    # MUI theme
│  │  │  └─ main.tsx
│  │  ├─ index.html
│  │  ├─ vite.config.ts
│  │  └─ package.json
│  │
│  └─ desktop/                          # Tauri wrapper
│     ├─ src-tauri/
│     │  ├─ src/                        # sidecar spawn, lifecycle, ports
│     │  ├─ tauri.conf.json
│     │  └─ Cargo.toml
│     └─ package.json
│
├─ services/
│  └─ api/                              # Fastify API (web + local desktop)
│     ├─ src/
│     │  ├─ routes/                     # auth, chat, docs, courses, notes, quizzes
│     │  ├─ db/                         # Drizzle client wrapper (PG/PGlite)
│     │  ├─ llm/                        # llama.cpp integration (desktop)
│     │  ├─ config.ts                   # MODE=web|desktop
│     │  └─ server.ts
│     └─ package.json
│
├─ packages/
│  ├─ db/                               # Drizzle schema + clients
│  │  ├─ src/
│  │  ├─ drizzle.config.ts
│  │  └─ package.json
│  ├─ core/                             # parsing, chunking, RAG helpers
│  │  ├─ src/
│  │  └─ package.json
│  ├─ contracts/                        # shared Zod + TS API schemas
│  │  ├─ src/
│  │  └─ package.json
│  ├─ entities/                         # shared entities (Chat, Message, etc)
│  │  ├─ src/
│  │  └─ package.json
│  └─ llm-client/                       # WebLLM + desktop client wrapper
│     ├─ src/
│     │  ├─ web/                        # WebLLM init/completions
│     │  ├─ desktop/                    # desktop endpoint client
│     │  └─ client.ts
│     └─ package.json
│
├─ .github/
│  └─ workflows/                        # desktop release workflow
├─ package.json                         # workspace root (bun)
├─ biome.json                           # lint/format config
└─ ROADMAP.md
```

# Database Schema (Drizzle)

**users**:
- id (primary key)
- email (unique)
- created_at

**chats**:
- id (primary key)
- user_id (foreign key -> users, indexed)
- name
- created_at

**messages**:
- id (primary key)
- chat_id (indexed)
- role (enum: user | assistant)
- content
- created_at
