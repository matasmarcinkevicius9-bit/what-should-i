Source: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
(Next.js docs, App Router, version 16.2.11, fetched 2026-07-23)

# Dynamic Route Segments (excerpt)

A URL path is a sequence of path segments. In the App Router, a segment may be
**static** (a literal value matched exactly) or **dynamic** (a placeholder that
captures a value from the URL). When you don't know a segment's value ahead of
time, define a Dynamic Segment to create routes from dynamic data. Next.js
passes the captured values to your page via the path `params` prop, either
filled in at request time or prerendered at build time.

## Convention

A Dynamic Segment can be created by wrapping a folder's name in square
brackets: `[folderName]`. For example, a blog could include the following
route `app/blog/[slug]/page.js` where `[slug]` is the Dynamic Segment for blog
posts.

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

## In Client Components

In a Client Component **page**, dynamic segments from props can be accessed
using the `use` API. Alternatively Client Components can use the `useParams`
hook to access the `params` anywhere in the Client Component tree.

## Behavior

Since the `params` prop is a promise, you must use `async`/`await` or React's
`use` function to access the values in a Server Component.

---

## How this was applied

`app/items/[id]/page.tsx` in this project is the detail route the must-haves
require ("a detail page with its own web address that opens the right item
directly"). Per the docs above, a Server Component page would receive `params`
as a `Promise` and need `await` — but this page is a Client Component
(`"use client"`), because the item data lives only in `localStorage` and there
is nothing a server render could fetch. Per the "In Client Components" section
above, the correct way to read the segment there is the `useParams()` hook
from `next/navigation`, not the `params` prop — so that's what
`lib/useItems.ts` / `app/items/[id]/page.tsx` uses, rather than guessing at an
API from training data (Next.js 16 changed this vs. older versions — see
`AGENTS.md`).
