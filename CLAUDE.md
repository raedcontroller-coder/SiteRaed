# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

The institutional website for **Raed** (raed.world), a software/AI development boutique — a Next.js 16 (App Router) app combining a public marketing site with an internal admin tool for sales operations (project quotes, AI-assisted commercial proposals).

Note the version: **Next.js 16.2.9 / React 19.2.4**, newer than most training data. Per `AGENTS.md`, consult `node_modules/next/dist/docs/` before relying on remembered Next.js APIs — async `cookies()`/`searchParams` and other breaking changes already apply throughout this codebase (see `lib/auth/session.js`, `app/admin/page.js`).

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals)
```

No test runner is configured. `test-db.js` (`node test-db.js`) is a standalone manual script that checks the `DATABASE_URL` connection — not part of the app.

Database (Drizzle ORM + Postgres):
```bash
npx drizzle-kit generate   # generate SQL migrations from lib/db/schema.js
npx drizzle-kit push       # push schema directly to the database
node scripts/seed.mjs      # seed/reset the admin users (see below)
```
No `drizzle/` migrations directory exists yet in this repo — schema changes so far have been pushed directly.

## Environment variables

Required in `.env` (gitignored, not present in repo): `DATABASE_URL` (Postgres), `SESSION_SECRET` (JWT signing key — falls back to an insecure hardcoded default if unset, so always set it), `GROQ_API_KEY` (Groq LLM API for AI features).

## Architecture

**Two audiences, one app:**
- **Public marketing site** (`app/page.js` + `components/*.jsx`): a single client-rendered landing page composed of `Header`, `Hero`, `About`, `Services`, `Clients`, `Footer`, `ContactModal`.
- **`/calculadora`**: a public, self-contained multi-step questionnaire (`app/calculadora/page.js`) that computes a project cost estimate from hardcoded question/pricing data and submits a lead via the `submitQuote` server action. It also calls `generatePitch` (Groq) to generate a persuasive sales pitch from the lead's answers.
- **`/admin`**: internal dashboard, gated by `middleware.js` (JWT session cookie check, redirects to `/login`). Lists received quotes (`QuoteTable`, paginated) and manages commercial proposals (`propostas/`) — an AI-assisted proposal builder (draft → refine → export as PDF).

**Auth**: Custom cookie-based sessions, not a library like NextAuth. `lib/auth/session.js` signs/verifies a JWT (`jose`) stored in an httpOnly `session` cookie; `app/actions/auth.js` validates credentials against `users` (bcrypt) and calls `createSession`. `middleware.js` is the sole enforcement point — protects `/admin/*` and bounces logged-in users away from `/login`. There is no per-request auth check inside route handlers/pages beyond `getSession()` calls sprinkled into server actions.

**Data layer**: `lib/db/schema.js` (Drizzle, Postgres) defines three tables — `users` (admin/client, role + level/xp fields), `projectQuotes` (leads from the calculator, `selections` stored as jsonb), `proposals` (AI-generated proposal content stored as jsonb per section, owned by a `userId`). `lib/db/index.js` exports a single shared `db` client (`postgres-js` driver). All mutations go through `"use server"` action files in `app/actions/` (`auth.js`, `quotes.js`, `proposals.js`, `generatePitch.js`) rather than API routes.

**AI integration**: Groq (`groq-sdk`, `llama-3.3-70b-versatile`) is used in two shapes:
- Server actions (`generatePitch.js`) for the calculator's sales pitch.
- Route handlers under `app/api/propostas/` (`draft`, `refine`) for the proposal editor, which need JSON responses fetched client-side from `EditProposalClient.js` / proposal creation UI — these use `response_format: { type: 'json_object' }` and return structured Markdown-per-section content.

`app/api/propostas/export/route.js` renders a proposal to PDF server-side: `md-to-pdf` converts Markdown to PDF (styled via `public/assets/propostas/estilo_proposta.css`, with a header logo and footer), then `pdf-lib` prepends a cover page (`public/assets/propostas/capa.pdf`) if present. `md-to-pdf` is Puppeteer-based, hence `serverExternalPackages: ['md-to-pdf']` in `next.config.mjs` and the Chromium/nss Nix packages in `nixpacks.toml` for deployment.

**Path alias**: `@/*` maps to the repo root (`jsconfig.json`), e.g. `@/lib/db`, `@/app/actions/quotes`.

**`conhecimento/`**: a gitignored local knowledge/reference directory (an older static HTML/CSS/JS version of the site, proposal templates, an unrelated particle-system experiment). Not part of the Next.js app — don't treat it as source to build against.
