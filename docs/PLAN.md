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

## Part 11 — Wheel label/divider redesign (done)
- Slice labels switched from a blurry black text-shadow halo to a clean
  rounded dark pill/chip behind the text — reads well on every slice color,
  including the black one
- Divider lines switched from a bright white glowing line to a subtle dark
  spoke (`rgba(0,0,0,0.45)`), matching a real prize-wheel's look instead of a
  shiny highlight

## Part 12 — Mobile responsive audit + fixes (done)
- Audited all must-have capabilities (2+ pages/detail URL, CRUD, persistence
  across reload, empty/not-found states, responsive layout) with a Playwright
  script across laptop (1280px) and phone (390/360/320px) viewports
- Found and fixed real horizontal-overflow bugs: the wheel's per-slice label
  wrappers and the rim's bulb wrappers are full-size boxes rotated in place —
  once rotated, an unrotated square's diagonal bounding box exceeds the
  circle they're clipped to visually but were never actually clipped in the
  DOM, so they silently pushed the page's scrollable width out past the
  viewport on every screen size (not just narrow ones — same bug, just not
  visible as a scrollbar until the viewport got tight). Fixed with
  `overflow-hidden` on both the wheel and the rim.
- Also added a `ResizeObserver`-driven wheel size (shrinks between 200–288px
  to fit its container) and made the add-item form stack vertically below
  the `sm` breakpoint instead of cramming three fields into one row
- Re-ran the same audit after the fix: zero horizontal overflow at any
  tested width, full CRUD/persistence/not-found flow verified at 375px

## Part 13 — Duel mode (done)
- New "🔥 Duel mode" toggle next to the category chips switches the wheel from a
  single-winner spin into a knockout bracket: each spin *eliminates* whichever
  item it lands on (instead of crowning it), and the wheel rebuilds from the
  survivors until one item remains as champion
- Favorite-weighting is inverted in duel mode — favorited items get smaller
  slices, so they're less likely to be landed on and more likely to survive to
  the end, preserving the "favorites have an edge" idea from the normal wheel
  but expressed as elimination odds instead of win odds
- Whole wheel re-themes while duel mode is active: flame slice palette, a
  red/black casing, orange ember bulbs instead of white, a flame-colored
  pointer and hub, darker dividers, and four pulsing 🔥 emoji around the rim
- Elimination banner ("🔥 X is knocked out — N left") between rounds; a
  small ember confetti burst on each elimination and a full flame-colored
  burst when the champion is crowned
- Champion gets its own reveal card (dark, flame-bordered, "🏆 Duel champion")
  with the usual detail-page link + mark-as-done, plus a "New duel" button
  that re-snapshots the current pool and starts over
- Switching category mid-duel re-snapshots the bracket to the new category's
  pool rather than leaving stale contestants around

## Later / optional (not committed to yet)
- Share a list via URL (encode list in query param or shareable link)
- Swap `localStorage` for a real DB + auth
- Multiple lists (movies list, food list, books list) instead of one
