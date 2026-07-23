# Reflection

## What I built and how I scoped it

**What Should I** — a "what should I watch/read/eat" picker: you keep a
personal list of items, and an animated wheel does a weighted random draw to
pick one for you. I scoped it to the must-haves first — CRUD on the list, a
`/items/[id]` detail page, localStorage persistence, empty/not-found states,
and a responsive layout — before touching anything extra. Everything beyond
that (dark mode, duel mode, the neon redesign) landed later as its own
numbered part in `docs/PLAN.md`, each as a separate commit.

## The persistence decision

Single-user, no backend, no auth — the only requirement was that the list
survives a reload on the same machine. That ruled out anything server-backed,
and IndexedDB felt like overkill for one flat array of items. I went with
`localStorage`, wrapped in a `useSyncExternalStore`-backed hook
(`lib/useItems.ts`) rather than a naive `useState` + `useEffect`, so reads and
writes stay synchronous and consistent across components without an
SSR/hydration mismatch.

## A technique that changed the outcome

`AGENTS.md` has a standing rule to check `node_modules/next/dist/docs/` (or
the real Next.js docs) before assuming an API from training data, since
Next.js 16 changed how dynamic route params work. That's what caught the
`/items/[id]` page needing `useParams()` instead of the server `params` prop —
documented with the actual doc excerpt and source URL in
`docs/NEXTJS_DYNAMIC_ROUTES.md`. Separately, a Playwright-driven audit against
the must-haves (Part 12) caught a real horizontal-overflow bug on narrow
viewports that manual checking at desktop width had missed.

## The design pass

Parts 8–11 were a deliberate visual pass: a neon marquee rim with pulsing
bulbs, a black/neon slice palette, and a divider/label redesign so it reads
like an actual prize wheel instead of the default scaffold look.

## Harder than the static-site lesson

Keeping `localStorage` state correct without a hydration mismatch has no
analog in a plain HTML/JS page — there's no server render to desync from.
Getting `useSyncExternalStore` and a stable `getServerSnapshot` right took
more care than a normal `useState`.

## What I'd change next time

I'd keep the one-part-per-commit discipline — it made it trivial to reset to
a good state. I'd scope stretch features (duel mode, the about page) more
cautiously relative to time spent polishing the core wheel interaction.
