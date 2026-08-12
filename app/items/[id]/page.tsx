"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useItems } from "@/lib/useItems";
import { StarIcon, PencilIcon, TrashIcon, ArrowLeftIcon, CheckIcon } from "@/components/icons";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { items, updateItem, removeItem, toggleDone, toggleFavorite } = useItems();
  const item = items.find((i) => i.id === id);

  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  function startEditing() {
    if (!item) return;
    setDraftTitle(item.title);
    setDraftCategory(item.category ?? "");
    setDraftNotes(item.notes ?? "");
    setEditing(true);
  }

  function saveEdit() {
    if (!item) return;
    const title = draftTitle.trim();
    if (!title) return;
    updateItem(item.id, {
      title,
      category: draftCategory.trim() || undefined,
      notes: draftNotes.trim() || undefined,
    });
    setEditing(false);
  }

  function handleDelete() {
    if (!item) return;
    removeItem(item.id);
    router.push("/");
  }

  return (
    <div className="flex flex-1 justify-center">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
        <Link
          href="/"
          className="stamp flex w-fit items-center gap-1.5 text-xs font-bold text-[var(--ink)]/70 hover:text-[var(--ink)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to list
        </Link>

        {!item ? (
          <p className="hard stamp p-6 text-sm text-[var(--ink)]/70 [--shadow-c:var(--neon-pink)]">
            This item doesn&apos;t exist — it may have been deleted, or the link is wrong.
          </p>
        ) : editing ? (
          <div className="hard flex flex-col gap-3 bg-[var(--panel)] p-6 [--shadow-c:var(--neon-cyan)]">
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="hard-sm bg-[var(--paper)] px-3 py-2 text-lg font-bold text-[var(--ink)] outline-none [--shadow-c:var(--ink)]"
            />
            <input
              value={draftCategory}
              onChange={(e) => setDraftCategory(e.target.value)}
              placeholder="category"
              className="hard-sm stamp bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40 [--shadow-c:var(--ink)]"
            />
            <textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="notes"
              rows={4}
              className="hard-sm bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40 [--shadow-c:var(--ink)]"
            />
            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                className="hard-sm press-sm bg-[var(--neon-lime)] px-4 py-2 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--ink)]"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="stamp px-4 py-2 text-sm text-[var(--ink)]/60 hover:text-[var(--ink)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="hard flex flex-col gap-4 bg-[var(--panel)] p-6 [--shadow-c:var(--neon-pink)]">
            <div className="flex items-start justify-between gap-4">
              <h1
                className={`font-display text-3xl uppercase tracking-wide text-[var(--ink)] ${
                  item.done ? "opacity-50 line-through" : ""
                }`}
              >
                {item.title}
              </h1>
              <button
                onClick={() => toggleFavorite(item.id)}
                aria-label={item.favorite ? "Unfavorite" : "Favorite"}
                className={`shrink-0 transition-transform hover:scale-110 ${
                  item.favorite ? "text-[var(--neon-orange)]" : "text-[var(--ink)]/25"
                }`}
              >
                <StarIcon className="h-7 w-7" filled={item.favorite} />
              </button>
            </div>

            {item.category && (
              <span className="stamp hard-sm w-fit bg-[var(--neon-violet)] px-3 py-1 text-xs font-bold text-[var(--ink)] [--shadow-c:var(--ink)]">
                {item.category}
              </span>
            )}

            {item.notes && (
              <p className="whitespace-pre-wrap text-sm text-[var(--ink)]/80">{item.notes}</p>
            )}

            <p className="stamp text-xs text-[var(--ink)]/40">
              Added {new Date(item.createdAt).toLocaleDateString()}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => toggleDone(item.id)}
                className={`hard-sm press-sm stamp flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold [--shadow-c:var(--ink)] ${
                  item.done ? "bg-[var(--neon-lime)] text-[var(--ink)]" : "bg-[var(--panel)] text-[var(--ink)]"
                }`}
              >
                <CheckIcon className="h-3.5 w-3.5" />
                {item.done ? "Done" : "Mark as done"}
              </button>
              <button
                onClick={startEditing}
                className="hard-sm press-sm stamp flex items-center gap-1.5 bg-[var(--panel)] px-3 py-1.5 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--neon-cyan)]"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="hard-sm press-sm stamp flex items-center gap-1.5 bg-[var(--panel)] px-3 py-1.5 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--neon-pink)]"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
