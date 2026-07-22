"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useItems } from "@/lib/useItems";

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
    <div className="flex flex-1 justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
        <Link
          href="/"
          className="w-fit text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Back to list
        </Link>

        {!item ? (
          <p className="text-sm text-zinc-500">
            This item doesn&apos;t exist — it may have been deleted, or the link is wrong.
          </p>
        ) : editing ? (
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-lg font-semibold dark:border-zinc-700"
            />
            <input
              value={draftCategory}
              onChange={(e) => setDraftCategory(e.target.value)}
              placeholder="category"
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            />
            <textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="notes"
              rows={4}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            />
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-md px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-4">
              <h1
                className={`text-2xl font-semibold text-zinc-900 dark:text-zinc-50 ${
                  item.done ? "opacity-60 line-through" : ""
                }`}
              >
                {item.title}
              </h1>
              <button
                onClick={() => toggleFavorite(item.id)}
                aria-label={item.favorite ? "Unfavorite" : "Favorite"}
                className={`shrink-0 text-2xl ${
                  item.favorite ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                }`}
              >
                ★
              </button>
            </div>

            {item.category && (
              <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {item.category}
              </span>
            )}

            {item.notes && (
              <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">{item.notes}</p>
            )}

            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Added {new Date(item.createdAt).toLocaleDateString()}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => toggleDone(item.id)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {item.done ? "Mark as not done" : "Mark as done"}
              </button>
              <button
                onClick={startEditing}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
