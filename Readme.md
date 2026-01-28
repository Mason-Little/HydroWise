# Stack:

### Frontend:

- **FrameWork**: React(Vite) + Ts
- **Auth**: AuthJS
- **Styling**: BaseUI + TailwindCSS
- **Linting/Formatting**: Biome

### Backend:

- **Lang**: Node.js
- **Api**: Fastify

### Database:

- **DataBase**: PostgreSQL
  - **Extentions**: pgVector
- **Framework**: Prisma

### Inference:

- **Web**: Wllama
- **Local**: llama.cpp(sideloaded)

# Features:

all of these features should allow for "@"ing courses/documents/terms???

- Standard Chat Bot with memory
- flash card generation
- course work quiz generation
- create notes assistant

### Gamification

- track the amount of wattage the computer is using and convert it to L/consumed
- compare to real world water usage ie. showers, baths, etc.

### Performance Running

- Allow users to dial how much performance of there computer they want to use (CPU/GPU)
- Find wattage Draw for the given thing they are doing. maybe a cool analytics page

## UI/UX

- Apple feel
- dark mode
- light mode
- system preference

# Business Logic:

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
your-app/
├─ apps/
│  ├─ web/                         # ONE React app (Vite) used by Web + Desktop
│  │  ├─ src/
│  │  ├─ index.html
│  │  ├─ vite.config.ts
│  │  └─ package.json
│  │
│  └─ desktop/                     # Tauri wrapper (loads apps/app build)
│     ├─ src-tauri/
│     │  ├─ src/
│     │  │  ├─ main.rs             # spawns local-api, postgres, llama
│     │  │  └─ processes.rs        # child-process lifecycle + ports
│     │  ├─ tauri.conf.json
│     │  └─ Cargo.toml
│     └─ package.json
│
├─ services/
│  ├─ web-api/                     # Fastify API for web (storage + pgvector)
│  │  ├─ src/
│  │  └─ package.json
│  │
│  └─ local-api/                   # Fastify API for desktop (local DB + RAG)
│     ├─ src/
│     └─ package.json
│
├─ packages/
│  ├─ db/                          # Prisma schema + migrations shared (cloud + local)
│  │  ├─ prisma/
│  │  │  └─ schema.prisma
│  │  └─ package.json
│  │
│  └─ core/                        # shared RAG utilities (chunking, prompts, types)
│     ├─ src/
│     └─ package.json
│
├─ tools/
│  ├─ dev.sh                       # runs app + cloud-api/local-api as needed
│  ├─ bundle-bins.sh               # (desktop) copy llama/postgres bins into resources
│  └─ README.md
│
├─ .github/
│  └─ workflows/
│     └─ desktop-release.yml       # builds DMG/ZIP via Tauri on macOS runner
│
├─ package.json                    # workspace root
└─ bun.lockb
```

# Types:

**UserTable**:

- user_id (primary key)
- user_name
- user_email
- user_createdAt

**Courses**:

- Course_id
- Course_name
- Document_IDs

**DocumentTable**:

- user_id (foreign key)
- Document_id (primary key)
- Document_name
- Document_type
- Document_createdAt

**RagTable**:

- Document_id (foreign key)
- Document_rag_id (primary_Key)
- Document_rag_embedding
- Document_rag_content
- Document_rag_createdAt
