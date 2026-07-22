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
  layout.tsx          # root layout, fonts, metadata
  page.tsx            # main page: renders ListManager + Picker
components/
  ListManager.tsx      # add/edit/delete/mark-done UI, "use client"
  ItemRow.tsx           # single item row inside the list
  Picker.tsx            # the wheel/reveal interaction, "use client"
lib/
  types.ts              # Item type
  useItems.ts            # localStorage-backed hook
```

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
