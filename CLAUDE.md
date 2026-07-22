# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## Project

**What Should I** — a "what should I watch / read / eat" random picker. You maintain a
personal list of items (movies, books, restaurants, whatever), and the app spins a wheel
to pick one for you.

- No backend, no auth — everything is persisted in `localStorage`.
- Single-list CRUD: add, edit, delete, mark items as "done".
- The centerpiece interaction is an animated spin (Framer Motion) that lands on a random
  item from the list.

See [docs/PLAN.md](docs/PLAN.md) for the build roadmap and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
for the data model and component layout.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion for the spin/reveal animation
- `localStorage` for persistence — no database, no server state

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # eslint
```

## Conventions

- Client components that touch `localStorage` or state must be marked `"use client"`.
- Keep all list/item persistence logic behind a single hook (see `docs/ARCHITECTURE.md`)
  rather than scattering `localStorage` calls through components.
- Favor small, focused components over one large page file.
- No comments explaining *what* code does — only *why*, when it's non-obvious.
- This project ships in parts; each meaningful part gets its own commit (see
  `docs/PLAN.md` for the part breakdown). Don't squash multiple parts into one commit.

## Workflow notes

- This repo is pushed to GitHub as `what-should-i` (public). Push after each part's
  commit unless told otherwise.
