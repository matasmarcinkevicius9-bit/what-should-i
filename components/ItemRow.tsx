"use client";

import { useState } from "react";
import Link from "next/link";
import type { Item } from "@/lib/types";

type Props = {
  item: Item;
  onUpdate: (id: string, patch: Partial<Omit<Item, "id" | "createdAt">>) => void;
  onRemove: (id: string) => void;
  onToggleDone: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

export function ItemRow({ item, onUpdate, onRemove, onToggleDone, onToggleFavorite }: Props) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(item.title);
  const [draftCategory, setDraftCategory] = useState(item.category ?? "");

  function saveEdit() {
    const title = draftTitle.trim();
    if (!title) {
      setDraftTitle(item.title);
      setEditing(false);
      return;
    }
    onUpdate(item.id, { title, category: draftCategory.trim() || undefined });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
          className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
        />
        <input
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
          placeholder="category"
          className="w-28 rounded-md border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700"
        />
        <button
          onClick={saveEdit}
          className="rounded-md bg-zinc-900 px-3 py-1 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="rounded-md px-3 py-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 ${
        item.done ? "opacity-50" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggleDone(item.id)}
        className="h-4 w-4 shrink-0 accent-zinc-900 dark:accent-zinc-50"
        aria-label={item.done ? "Mark as not done" : "Mark as done"}
      />

      <div className="min-w-0 flex-1">
        <Link
          href={`/items/${item.id}`}
          className={`block truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50 ${
            item.done ? "line-through" : ""
          }`}
        >
          {item.title}
        </Link>
        {item.category && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.category}</span>
        )}
      </div>

      <button
        onClick={() => onToggleFavorite(item.id)}
        aria-label={item.favorite ? "Unfavorite" : "Favorite"}
        className={`shrink-0 text-lg ${item.favorite ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
      >
        ★
      </button>

      <button
        onClick={() => setEditing(true)}
        className="shrink-0 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        Edit
      </button>

      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 text-sm text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
}
