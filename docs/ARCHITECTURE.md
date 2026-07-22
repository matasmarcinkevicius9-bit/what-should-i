# Architecture

## Data model

```ts
type Item = {
  id: string;          // crypto.randomUUID()
  title: string;
  category?: string;   // free-text tag, e.g. "movie", "restaurant"
  notes?: string;
  favorite: boolean;    // weights random picks in its favor
  done: boolean;        // excluded from the picker once true
  createdAt: number;    // Date.now()
};
```

All items for the app live in a single list, persisted under one `localStorage` key
(`what-should-i:items`). No per-category storage — filtering happens in memory.

## Persistence

A single hook, `useItems()` (in `lib/useItems.ts`), owns all reads/writes to
`localStorage`:

- Loads once on mount (guarded for SSR — `localStorage` isn't available server-side)
- Exposes `items`, `addItem`, `updateItem`, `removeItem`, `toggleDone`
- Every mutation writes the full list back to `localStorage` immediately (no debouncing
  needed at this scale)

Components never call `localStorage` directly — they go through this hook.

## Component layout

```
app/
  layout.tsx          # root layout, fonts, metadata, theme init script + toggle
  page.tsx            # main page: renders Picker + ListManager
  items/[id]/page.tsx  # item detail page, its own URL — /items/<uuid>
components/
  ListManager.tsx      # add/edit/delete/mark-done UI, "use client"
  ItemRow.tsx           # single item row inside the list; title links to /items/[id]
  Picker.tsx            # the wheel/reveal interaction, "use client"
  ThemeToggle.tsx        # fixed-corner sun/moon dark-mode toggle, "use client"
lib/
  types.ts              # Item type
  useItems.ts            # localStorage-backed hook (items)
  itemsStore.ts           # useSyncExternalStore store backing useItems
  useTheme.ts             # localStorage-backed hook (theme)
  themeStore.ts            # useSyncExternalStore store backing useTheme
```

## Routing / item detail page

`/items/[id]` is a client component (`useParams()` from `next/navigation`, not the
server `params` prop — the item data only exists in `localStorage`, so there's
nothing a server render could fetch). It looks the id up in the same `useItems()`
store everything else uses, so it's always in sync with the list — no separate
fetch or cache. If the id isn't found (deleted item, mistyped URL, or a link from
another browser where that id was never created — this app has no shared backend)
it shows a small "doesn't exist" message with a link back to `/` instead of
crashing. Item titles in the list and in the wheel's reveal card link here.

## Theme (light/dark)

Tailwind's `dark:` variant is redefined in `globals.css` via
`@custom-variant dark (&:where(.dark, .dark *));` so it responds to a `.dark`
class instead of only `prefers-color-scheme`. `themeStore.ts` mirrors
`itemsStore.ts`'s pattern: it owns the `.dark` class on `<html>` and persists
the choice to `localStorage`, defaulting to system preference if nothing is
stored yet.

A small blocking `<script>` in the root layout applies the stored (or
system-preferred) theme class before React hydrates, to avoid a flash of the
wrong theme on load. Because that script mutates `<html>` outside of React,
the `<html>` tag carries `suppressHydrationWarning` — otherwise React flags a
hydration mismatch on its `className`, even though the mismatch is intentional
and only ever affects that one attribute.

## The picker

`Picker` derives its pool from `items`: filter out `done` items, then filter to the
selected category (if any — category chips are only shown once at least one item has
a category). Each item in the pool gets a weight (`favorite` items get `FAVORITE_WEIGHT`,
currently `3`; everything else gets `1`); the wheel's conic-gradient slices are sized
proportionally to weight, so a favorite's better odds are visible as a bigger slice, not
just felt. Picking a winner (a weighted random draw) happens before the spin animation
starts — the animation dramatizes an already-known result rather than driving the
randomness itself. The rotation needed to land the winning slice under the fixed-top
pointer is computed from the slice's midpoint angle, always adding forward rotation
(never snapping backward) so consecutive spins feel continuous.
