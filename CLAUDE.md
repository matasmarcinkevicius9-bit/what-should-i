# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**What Should I** — a "what should I watch / read / eat" random picker. You maintain a
personal list of items (movies, books, restaurants, whatever), and an animated wheel picks
one for you.

- No backend, no auth, no database — everything lives in `localStorage`. This is a
  client-only app; every interactive component is `"use client"`.
- Full CRUD on a single list of items, plus a second page: `/items/[id]` opens one item
  directly at its own URL.
- The centerpiece is `components/Picker.tsx` — a neon-styled spinning wheel (Framer
  Motion + `canvas-confetti`) that does a weighted random draw favoring starred items.

See [docs/PLAN.md](docs/PLAN.md) for the part-by-part build history and
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a deep dive on the picker's math
(slice/divider geometry, responsive sizing, the bulb-ring "marquee" effect) and the
theme system.

## Commands

```bash
npm run dev      # start dev server (Turbopack) — http://localhost:3000
npm run build    # production build; also the fastest way to type-check the whole project
npm run lint     # eslint (flat config: eslint-config-next core-web-vitals + typescript)
npm run start    # serve a production build
```

There is no test suite. Changes are verified with `npm run build` (catches type errors)
plus manual/browser verification. For UI changes, the established pattern in this repo's
history is: `npm install -D playwright`, write a throwaway script that drives
`http://localhost:3000` and takes screenshots, run it, then delete the script and
`npm uninstall playwright` before committing — check `git diff package.json` is empty
afterward so no leftover test dependency gets committed.

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion.** Next 16 has
  real breaking changes vs. older training data (see `AGENTS.md` at the repo root) — check
  `node_modules/next/dist/docs/` before assuming an API from memory.
- **Two routes:** `app/page.tsx` (list + picker) and `app/items/[id]/page.tsx` (detail
  page). The detail page is a client component using `useParams()` from `next/navigation`,
  *not* the server `params` prop — there's nothing a server render could fetch, since item
  data only exists in the client's `localStorage`.
- **State pattern — repeated twice, follow it for anything similar:** a plain module
  (`lib/itemsStore.ts`, `lib/themeStore.ts`) owns an in-memory cache, reads/writes
  `localStorage`, and exposes `subscribe`/`getSnapshot`/`getServerSnapshot`. A thin hook
  (`lib/useItems.ts`, `lib/useTheme.ts`) wraps it with `useSyncExternalStore`. This avoids
  the SSR/hydration mismatch and the `react-hooks/set-state-in-effect` lint error that a
  naive `useState` + `useEffect(() => localStorage...)` approach hits — `getServerSnapshot`
  must return a **stable/cached reference** (not a fresh array/object each call) or React
  warns about a possible infinite loop.
- **Theme:** Tailwind's `dark:` variant is redefined in `app/globals.css` via
  `@custom-variant dark (&:where(.dark, .dark *));` so it's class-driven, not the v4
  default `prefers-color-scheme` media query. A blocking `<script>` in `app/layout.tsx`
  applies the stored/system theme before hydration (flash-of-wrong-theme prevention),
  which is why `<html>` carries `suppressHydrationWarning`.
- **Component layout:**
  ```
  app/layout.tsx          root layout, fonts, theme init script, <ThemeToggle/>
  app/page.tsx            renders <Picker/> + <ListManager/>
  app/items/[id]/page.tsx detail page
  components/
    ListManager.tsx       add/edit/delete/mark-done UI
    ItemRow.tsx           one list row; title links to /items/[id]
    Picker.tsx            the wheel — see docs/ARCHITECTURE.md for the geometry
    ThemeToggle.tsx        sun/moon corner toggle
    icons.tsx              shared inline-SVG icon set
  lib/
    types.ts              Item type
    useItems.ts / itemsStore.ts   localStorage-backed items store
    useTheme.ts / themeStore.ts   localStorage-backed theme store
  ```
- **The wheel (`Picker.tsx`) is the most intricate file.** Non-obvious things worth
  knowing before touching it: slice/divider angles are computed together so weighted
  (favorited) slices stay in sync; the wheel size is driven by a `ResizeObserver`, not a
  fixed constant, so it fits phone-width viewports; and both the wheel and its rim need
  `overflow-hidden` because each rotated label/bulb wrapper is a full-size square whose
  corners swing outside the circle once rotated — without clipping, that silently
  widens the page's scrollable area on every screen size, not just narrow ones. Full
  writeup in `docs/ARCHITECTURE.md`.

## Conventions

- Favor small, focused components over one large page file.
- No comments explaining *what* code does — only *why*, when it's non-obvious.
- This project has shipped in numbered "parts" (see `docs/PLAN.md`), each landing as its
  own commit with a message describing that part. Continue that pattern for new work
  rather than bundling unrelated changes into one commit.
- Repo is public on GitHub as `what-should-i`; push after each commit unless told otherwise.
