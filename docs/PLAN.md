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

## Part 5 — Dark mode toggle (done)
- Fixed-corner sun/moon button (`ThemeToggle`) toggles a `.dark` class on `<html>`
- `dark:` Tailwind variant switched to class-based (`@custom-variant dark`) so the
  toggle can override system preference
- Choice persisted to `localStorage`, defaults to system preference; a blocking
  init script prevents a flash of the wrong theme on load

## Part 6 — Item detail page (done)
- Second page, its own address: `/items/[id]` opens a single item directly
- Item titles (in the list and in the wheel's reveal card) link there
- Detail page can edit title/category/notes, toggle favorite/done, delete
  (redirects back to `/`), and shows a friendly "doesn't exist" state for a
  bad/stale id instead of crashing

## Part 7 — Wheel polish + confetti (done)
- Thin white divider lines between slices (a second conic-gradient layered as an
  extra background image, positioned at each slice boundary)
- Decorative rim (gradient ring) around the wheel and a raised gradient hub
- `canvas-confetti` burst, colored from the wheel's own palette, fires the moment
  a winner is revealed
- `whileHover`/`whileTap` motion on the spin button and category chips; the
  reveal card gets a soft glow tinted with the winning slice's color

## Part 8 — Neon marquee rim (done)
- Wheel rim switched to a dark gradient casing with a ring of white bulbs
  (fixed count, independent of item count) evenly spaced around it
- Each bulb pulses on its own delay offset so the ring reads as a chasing
  marquee light, sped up while the wheel is spinning
- Pointer and hub picked up a matching white glow for a cohesive neon look

## Part 9 — Neon slice palette (done)
- Slice colors switched to a neon palette: black, neon green, neon red, cyan,
  yellow, magenta (cycled by index like before)
- Labels got a black text-shadow halo so they stay legible on both the black
  slice and the brightest neon slices
- A slight `saturate`/`brightness` filter on the wheel keeps the colors vivid

## Part 10 — Whole-app visual pass (done)
- New shared `components/icons.tsx` (star, pencil, trash, plus, arrow, check) —
  replaced plain text buttons ("Edit"/"Delete") and the ★ character everywhere
- Gradient title, section eyebrow labels ("Pick for me" / "Your list"), and a
  subtle radial color wash behind both pages, tying the page chrome to the
  wheel's neon palette
- List rows: pill-style category badges, custom checkbox with a check icon,
  hover elevation, and enter/exit motion when items are added or removed
- Detail page: matching category pill and icon+label action buttons

## Later / optional (not committed to yet)
- Share a list via URL (encode list in query param or shareable link)
- Swap `localStorage` for a real DB + auth
- Multiple lists (movies list, food list, books list) instead of one
