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

## Part 14 — About page (done)
- Static `/about` page: heading, one-sentence description of the app, and a
  link back to `/`
- Fixed top-left "info" button (mirrors the theme toggle's corner-button
  pattern on the opposite corner) links to it from every page

## Part 15 — Visual polish pass (done)
- Custom brand favicon (`app/icon.svg`, a small gradient wheel echoing the
  picker) replacing the default Next.js icon; `app/favicon.ico` removed so
  there's a single unambiguous icon source
- Removed the unused default Next.js scaffold assets in `public/`
  (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) that
  shipped from `create-next-app` and were never referenced
- `viewport.themeColor` (light/dark) so the mobile browser chrome matches
  the app's background instead of showing the OS default
- Brand-colored `::selection` (fuchsia) instead of the browser default
- `app/template.tsx` adds a short fade/slide-in on every route change
  (Framer Motion), so navigating between `/`, `/items/[id]`, and `/about`
  feels like a single app instead of a hard page swap — verified it doesn't
  reintroduce the mobile horizontal-overflow issue from Part 12

## Part 16 — Custom 404 + error page (done)
- `app/not-found.tsx` replaces the default blank Next.js 404 with an
  on-brand page (gradient "404", themed copy, a link back to `/`) — confirmed
  it still returns a real HTTP 404 status, not just a 200 with 404-looking
  content
- `app/error.tsx` catches unexpected runtime errors with a similar themed
  page, a "Try again" button, and a link home. Uses Next 16's current
  `unstable_retry` prop (the old `reset` prop from earlier Next versions),
  confirmed against the installed `next` package's own docs rather than
  assumed from memory

## Part 17 — Brutalist × neon visual identity (done)
- Whole-app style overhaul: zero border-radius, thick black/bone structural
  borders, and hard *offset* drop shadows (no blur) in place of the previous
  soft rounded-xl/shadow-sm look — every panel, button, input, and tag now
  reads as a raw slab with a colored neon shadow instead of a translucent
  glow
- New font system replacing Geist: `Anton` for display/UI type, `Space Mono`
  for stamped uppercase labels/meta, `Archivo` for body copy, and `Monoton`
  — a font literally modeled on neon tube lettering — reserved for the one
  signature element, the "What Should I" wordmark
- Signature element: the home page header is a bolted dark slab with the
  Monoton wordmark glowing via CSS `text-shadow`, plus a one-shot flicker
  keyframe on load (skipped under `prefers-reduced-motion`)
- New CSS custom-property token system in `globals.css` (`--paper`, `--ink`,
  `--panel`, five named `--neon-*` accents) and two reusable classes,
  `.hard`/`.hard-sm` (border + offset shadow) and `.press`/`.press-sm`
  (shadow "presses in" on click), used everywhere instead of duplicating
  Tailwind shadow/border utility strings per component
- Wheel recased as bolted arcade-cabinet metal (fixed dark casing regardless
  of site theme, matching the neon-sign header's logic) with a chunky
  neon-lime hazard-stripe pointer; slice palette swapped to neon
  pink/cyan/lime/violet/orange; category chips and reveal cards rebuilt as
  hard-edged stamped tags/panels instead of pills
- Caught and fixed a real theme-contrast bug during the pass: the shared
  `.hard` border color is theme-reactive (`var(--ink)`, black in light mode
  / bone in dark mode), which is correct for normal panels but goes
  near-invisible against the header/404/error panels that are intentionally
  a fixed dark slab in both themes — fixed by pinning those specific borders
  to an explicit neon color via inline style instead of the token
- Verified light + dark theme and desktop/mobile widths with a temporary
  Playwright script (installed, screenshotted, then uninstalled per the
  project's established pattern — confirmed `git diff package.json` stayed
  empty)

## Later / optional (not committed to yet)
- Share a list via URL (encode list in query param or shareable link)
- Swap `localStorage` for a real DB + auth
- Multiple lists (movies list, food list, books list) instead of one
