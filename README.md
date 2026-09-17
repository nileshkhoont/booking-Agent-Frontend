# AI Calling Agent — Frontend

Next.js 15 (App Router) + TypeScript admin dashboard. Talks only to this project's FastAPI
backend (`NEXT_PUBLIC_API_BASE_URL`) — never to Edesy directly; the Edesy API key stays
server-side only, inside the backend.

## Setup

```bash
npm install
cp .env.local.example .env.local

npm run dev
```

Requires the backend running at the URL in `.env.local`, with at least one admin seeded
(`python scripts/seed_admin.py ...` in `backend/`) so you can log in.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (also type-checks)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run test` — Vitest unit tests
