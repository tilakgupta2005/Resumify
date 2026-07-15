# Resumify — Backend

A FastAPI backend for building resumes: users manage a "base resume" (personal
info, education, experience, projects, certifications, skills, etc.), and can
generate a job-description-tailored version of it (re-ranked/optimized
sections + an AI-written professional summary) as a rendered PDF.

Auth, storage, and RPC (stored-procedure) calls all go through **Supabase**
(Postgres + Auth). AI features (LLM + embeddings) go through **Google
Gemini** and a local **HuggingFace** sentence-transformer model.

---

## 1. Tech stack

| Layer | Tech |
|---|---|
| API framework | FastAPI |
| Database | Supabase (Postgres), accessed via `supabase-py` RPC calls |
| Auth | Supabase Auth (JWT, verified against Supabase's JWKS endpoint) |
| LLM | Google Gemini via `langchain-google-genai` |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` via `langchain-huggingface` (runs locally, downloads the model on first run) |
| PDF rendering | Jinja2 → `.tex` → XeLaTeX → PDF |

---

## 2. Project structure

```
Backend/
├── app/
│   ├── main.py                  # FastAPI app, CORS, router registration
│   ├── core/
│   │   ├── config.py             # Settings (reads .env)
│   │   ├── database.py           # Supabase client (cached singleton)
│   │   ├── security.py           # get_current_user dependency
│   │   └── ai_provider.py        # LLM + embedding model instances
│   ├── router/                   # HTTP endpoints (thin — validate + call services)
│   │   ├── auth.py               # /auth/signup, /auth/login
│   │   ├── base_resume.py        # /base_resume/* CRUD
│   │   └── jd_resume.py          # /jd_resume/generate-resume
│   ├── schema/                   # Pydantic request/response models
│   ├── services/                 # Business logic, Supabase RPC calls, LLM calls
│   ├── prompt/                   # LangChain prompt templates
│   └── utils/                    # embedding, BM25 search, misc helpers
├── templates/
│   └── jakes_resume.tex          # LaTeX resume template (Jinja2-rendered)
├── base_schema.sql               # Full DB schema (run once on a fresh Supabase project)
├── create_resume.sql             # save_resume() Postgres function (create/update)
├── get_resume.sql                # get_resume() Postgres function
├── top_project.sql               # get_top_projects() Postgres function
├── migration_fix_personal_info_unique.sql   # one-off migration (see below)
└── requirements.txt
```

**Request flow:** `router/` validates the request against a `schema/` model →
calls a function in `services/` → service either calls a Postgres function
via `database.get_supabase_client().rpc(...)` or calls the LLM/embeddings via
`core/ai_provider.py`.

---

## 3. Prerequisites

- **Python 3.11+**
- **A Supabase project** (free tier is fine) — you need its project URL and
  API key.
- **A Google AI Studio API key** (for Gemini) — the LLM is used for the
  JD-tailored resume + professional summary generation feature.
- **XeLaTeX** installed and on your `PATH`, only if you want to use the PDF
  export feature (part of any TeX Live / MiKTeX distribution — e.g.
  `sudo apt install texlive-xetex` on Ubuntu, or install MiKTeX on Windows).
  Everything else works without it.

---

## 4. Setup

### 4.1 Clone and install dependencies

```bash
git clone <repo-url>
cd Backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4.2 Set up the Supabase database

In your Supabase project's **SQL Editor**, run these files **in order**:

1. `base_schema.sql` — creates all tables (`personal_info`, `location`,
   `education`, `experience`, `projects`, `certifications`, `skills`, etc.)
   and enables the `pgvector` extension (needed for the embedding columns
   used in JD-matching).
2. `create_resume.sql` — creates the `save_resume(p_user_id, p_resume)`
   function, used by create/update.
3. `get_resume.sql` — creates the `get_resume(p_user_id)` function.
4. `top_project.sql` — creates the `get_top_projects(p_user_id, p_embedding,
   p_limit)` function, used for JD-based project matching.

> If you're setting up a **fresh** database, `base_schema.sql` already
> includes everything needed — skip step 5.
>
> If you're applying these changes to an **existing** database that was
> created before the `personal_info.user_id` unique-constraint fix, also
> run:
> 5. `migration_fix_personal_info_unique.sql`

You can verify what's installed with:
```sql
SELECT proname FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';
```
You should see `save_resume`, `get_resume`, and `get_top_projects` (and
`get_jdbased_resume` if you've created it — it's not used by the current
codebase).

### 4.3 Create your `.env` file

Copy the template below into a file named `.env` in the `Backend/` root (next
to `requirements.txt`). See section 5 for what each value means and where to
find it.

### 4.4 Run the server

```bash
uvicorn app.main:app --reload
```

- API base URL: `http://localhost:8000`
- Interactive docs (Swagger UI): `http://localhost:8000/docs`
- Health check: `GET /health` → `{"status": "OK"}`

The first run will download the HuggingFace embedding model
(`all-MiniLM-L6-v2`, a few hundred MB) — this can take a minute or two and
only happens once (cached locally afterward).

---

## 5. Environment variables (`.env`)

```dotenv
# --- Supabase --------------------------------------------------------------
# Project Settings → API in your Supabase dashboard.
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_KEY=<your-supabase-service-role-or-anon-key>

# --- Auth --------------------------------------------------------------
# Required for the app to start (Settings is a required field), even though
# incoming tokens are currently verified against Supabase's JWKS endpoint
# rather than this secret directly. Any non-empty string works, but keep it
# secret and consistent with your Supabase project's JWT settings.
JWT_SECRET_KEY=<any-secret-string>
JWT_ALGORITHM=ES256
JWKS_CACHE_TTL_SECONDS=300

# --- LLM / embeddings --------------------------------------------------
# Required by langchain-google-genai to call Gemini.
GOOGLE_API_KEY=<your-google-ai-studio-api-key>

# --- PDF rendering (optional) -------------------------------------------
# Leave blank to auto-detect `xelatex` on your PATH. Only set this if
# XeLaTeX isn't on PATH or you want to point at a specific binary.
LATEX_EXECUTABLE_PATH=
```

| Variable | Required? | Notes |
|---|---|---|
| `SUPABASE_URL` | Yes | From Supabase dashboard → Project Settings → API |
| `SUPABASE_KEY` | Yes | Same page. Use the `service_role` key for local dev so backend calls aren't blocked by Row-Level Security; if you use the `anon` key, make sure your RLS policies allow the operations this API performs. |
| `JWT_SECRET_KEY` | Yes (app won't start without it) | See note above |
| `JWT_ALGORITHM` | No (defaults to `ES256`) | Not currently read by the auth logic (hardcoded to `ES256`), kept for future use |
| `JWKS_CACHE_TTL_SECONDS` | No (defaults to `300`) | Reserved for future use |
| `GOOGLE_API_KEY` | Yes, for JD-tailored resume generation | Get one at https://aistudio.google.com/apikey. Signup/login/base-resume CRUD work without it; only `/jd_resume/generate-resume` needs it. |
| `LATEX_EXECUTABLE_PATH` | No | Only needed for PDF export; leave blank to auto-detect |

A few settings in `app/core/config.py` (`llm_provider`, `llm_model_name`,
`embedding_provider`, `embedding_model_name`) exist for future
multi-provider support but aren't wired up yet — `app/core/ai_provider.py`
currently hardcodes Gemini (`gemini-3.1-flash-lite`) and
`all-MiniLM-L6-v2`. You don't need to set them.

---

## 6. API overview

All endpoints except `/auth/*`, `/`, and `/health` require an
`Authorization: Bearer <access_token>` header (the `access_token` returned
by `/auth/login`).

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/signup` | Create a Supabase Auth user |
| POST | `/auth/login` | Log in, returns `access_token` + `refresh_token` |
| GET | `/base_resume/base_resume` | Fetch the current user's base resume |
| POST | `/base_resume/create_base_resume` | Create the current user's base resume |
| PUT | `/base_resume/update_base_resume` | Update the current user's base resume (send the **full** resume object — see note below) |
| POST | `/jd_resume/generate-resume` | Generate a job-description-tailored resume (re-ranked sections + AI summary + PDF) |

**Important:** `create_base_resume` and `update_base_resume` both expect the
**entire** `ResumeDetails` object in the body, not just the section being
edited. The underlying `save_resume()` Postgres function deletes and
re-inserts every section on every call — there's currently no
per-section/partial-update endpoint. If your frontend edits resumes
section-by-section (personal info, education, experience, projects, etc.),
merge the edited section into the full resume object client-side before
calling either endpoint.

Full request/response schemas are in `app/schema/`, and interactive,
try-it-yourself docs are at `/docs` once the server is running.

---

## 7. Common gotchas

- **App fails to start with a pydantic `ValidationError` about missing
  fields** → check your `.env` has `SUPABASE_URL`, `SUPABASE_KEY`, and
  `JWT_SECRET_KEY` set (these have no defaults).
- **500 error on `/jd_resume/generate-resume`** → almost always a missing/
  invalid `GOOGLE_API_KEY`, or the embedding model failing to download
  (check your network/proxy).
- **PDF export fails / `xelatex not found`** → install a TeX distribution
  and make sure `xelatex` is on your `PATH`, or set
  `LATEX_EXECUTABLE_PATH` explicitly.
- **401 on authenticated endpoints** → the token must be a Supabase **access
  token** (from `/auth/login`), not the refresh token, and must be sent as
  `Authorization: Bearer <token>`.
- **First request is slow** → the HuggingFace embedding model loads at
  import time (see `app/core/ai_provider.py`), so the *first* server start
  after install will pause while it downloads/loads.
