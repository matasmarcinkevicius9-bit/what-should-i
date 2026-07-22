# Build Plan

This project is being built part by part, each part landing as its own commit.

## Part 1 — Scaffold (done)
- Next.js + TypeScript + Tailwind app via `create-next-app`
- `docs/` folder, `CLAUDE.md`, GitHub repo created and pushed

## Part 2 — Data model + list CRUD (done)
- `Item` type (id, title, category, notes, favorite, done, createdAt)
- `useItems` hook, backed by a `useSyncExternalStore` store over `localStorage`
- List page: add item form, list view, edit, delete, mark done, favorite

## Part 3 — The picker (done)
- Spin/reveal interaction (Framer Motion): a conic-gradient wheel that spins
  and lands on a randomly chosen *not-done* item
- Excludes done items from the pool; handles empty/all-done state
- Result card animation ("reveal") with a mark-as-done shortcut

## Part 4 — Categories, weighting, polish (done)
- Category filter chips above the wheel — spin only within the selected category
- Favorites get a higher chance of being picked (weighted random, and the wheel
  slices are sized proportionally so the odds are visible, not just felt)
- Empty states differentiate "list is empty" vs "nothing in this category" vs
  "everything here is done"

## Later / optional (not committed to yet)
- Share a list via URL (encode list in query param or shareable link)
- Swap `localStorage` for a real DB + auth
- Multiple lists (movies list, food list, books list) instead of one
