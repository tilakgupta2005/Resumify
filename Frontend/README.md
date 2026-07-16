# Resumify — AI Resume Crafting Platform

Resumify is a modern, high-performance web application designed to help job seekers build, manage, and optimize ATS-friendly resumes. With an integrated AI assistant, users can paste target job descriptions and instantly generate custom, tailored resumes formatted perfectly for ATS (Applicant Tracking Systems).

---

## 🚀 Tech Stack

### Frontend & Core Framework

- **React** & **TypeScript**
- **TanStack Start**: Provides full-stack server-side rendering (SSR), isomorphic routing, and streaming HTML hydration.
- **TanStack Router**: Manages page routing, context injections, page transitions, and search validation.
- **TanStack Query** (React Query): Powers local caching, mutation, state synchronization, and background refetching.

### Styling & Animation

- **Tailwind CSS v4**: Utility-first CSS compiling with LightningCSS.
- **Vanilla CSS Variables**: Defines the core palette tokens, dark modes, animations, and custom scrollbar styles.
- **Framer Motion**: Delivers premium micro-animations, loading indicators, and page transitions.
- **Lucide React**: Renders clean, modern interface icons.

### Networking & Client Services

- **Axios**: Manages HTTP communications, token injection interceptors, and blob response parses.

### Production Environment

- **Nitro Service Engine**: Compiles the application server into a Cloudflare Worker Module (`cloudflare-module` preset) for deployment.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm package manager

### 1. Clone the Repository

```bash
git clone https://github.com/tilakgupta2005/resume-craft.git
cd resume-craft
```

### 2. Setup Environment Variables

Create a `.env` file in the project root:

```env
# Backend server URL (API Base)
VITE_API_BASE_URL="http://127.0.0.1:8000/"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The server will boot and make the local site available at:

- Local: `http://localhost:5173/`

### 5. Production Build

To compile the client bundle, SSR server bundle, and the Wrangler-ready Nitro Worker:

```bash
npm run build
```

The output files will compile into the `.output/` directory:

- Static public files: `.output/public/`
- Server entry point: `.output/server/`

To preview the production build locally:

```bash
npx vite preview
```

---

## 🌐 API Integration Endpoints

All endpoints are configured with a bearer token authorization header automatically injected by the Axios client interceptor.

### 🔑 Authentication

- `POST /auth/signup`
  - **Payload**: `{ Name: string, Email: string, password: string }`
  - **Returns**: User details and authentication JWT access tokens.
- `POST /auth/login`
  - **Payload**: `{ Email: string, password: string }`
  - **Returns**: User details and authentication JWT access tokens.
- `POST /auth/forgot-password`
  - **Payload**: `{ email: string }`
  - **Returns**: A JSON message confirming the reset link email.
- `POST /auth/reset-password`
  - **Payload**: `{ access_token: string, refresh_token: string, password: string }`
  - **Returns**: A JSON message confirming successful password update.

### 📄 Base Resume Management

- `GET /base_resume/base_resume`
  - **Returns**: The active logged-in user's base resume payload.
- `POST /base_resume/create_base_resume`
  - **Payload**: Full JSON resume schema structure.
  - **Returns**: Created resume payload.
- `PUT /base_resume/update_base_resume`
  - **Payload**: Updated JSON resume schema structure.
  - **Returns**: Updated resume payload.

### 🤖 AI Resume Personalizer

- `POST /jd_resume/generate-resume`
  - **Params**: `jd_text` (String containing the full target job description).
  - **Returns**: A binary PDF payload of the customized, ATS-aligned resume.

---

## 📂 Project Structure

```
resume-craft/
├── .output/                 # Production server & static bundle outputs
├── .wrangler/               # Local cloudflare deployment files
├── public/                  # Static assets (Favicon, sitemap, robots.txt)
├── src/                     # Core application source
│   ├── components/          # Reusable react components
│   │   ├── app-layout.tsx   # Root navigation shell with theme switcher
│   │   └── ui-kit.tsx       # Standard UI elements (PillButton, Card, Stats)
│   ├── lib/                 # Core utilities and state
│   │   ├── api.ts           # Axios request instances & error parsing interceptors
│   │   ├── queries.ts       # React Query hooks for fetching, updating, and generating
│   │   ├── resume-schema.ts # Validation schemas and completion calculators
│   │   ├── use-auth.ts      # Authentication tokens & localStorage sync listeners
│   │   └── error-reporting.ts # Generic application error boundary logger
│   ├── routes/              # TanStack router page tree
│   │   ├── __root.tsx       # Root document shell with head & JSON-LD markup
│   │   ├── index.tsx        # Client redirect logic landing page
│   │   ├── auth.tsx         # Login and Sign up authentication forms
│   │   ├── dashboard.tsx    # Workspace overview with stats & step completion card
│   │   ├── builder.tsx      # Multi-step resume details form wizard (Sticky layout)
│   │   ├── profile.tsx      # Registered user contact card
│   │   └── ai.tsx           # AI JD custom compiler with progressive loading stream
│   ├── server.ts            # Server-side hydration entry
│   ├── start.ts             # App instance initialization definitions
│   └── styles.css           # Global CSS variables, custom scrolls & tailwind v4 imports
├── eslint.config.js         # ESLint specifications
├── tsconfig.json            # TypeScript compile configurations
└── vite.config.ts           # Vite plugin ordering & compiler settings
```

---

## 🔒 Security & Deployment Readiness

- **Cors Headers**: Configured to support local development alongside third-party deployment providers.
- **Secure Environments**: Local secret storage gitignored to prevent credential leakage.
- **0 Vulnerabilities**: Validated dependency tree audits.
- **Strict Lints**: Zero compilation warnings, formatting differences, or TypeScript type compilation blockages.
