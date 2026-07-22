"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Item } from "@/lib/types";
import { StarIcon, PencilIcon, TrashIcon, CheckIcon } from "./icons";

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
      <li className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-transparent px-2.5 py-1.5 text-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 dark:border-zinc-700"
        />
        <input
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
          placeholder="category"
          className="w-28 rounded-lg border border-zinc-300 bg-transparent px-2.5 py-1.5 text-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 dark:border-zinc-700"
        />
        <button
          onClick={saveEdit}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Cancel
        </button>
      </li>
    );
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: item.done ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <button
        onClick={() => onToggleDone(item.id)}
        aria-label={item.done ? "Mark as not done" : "Mark as done"}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          item.done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-zinc-300 text-transparent hover:border-zinc-400 dark:border-zinc-600"
        }`}
      >
        <CheckIcon className="h-3 w-3" />
      </button>

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
          <span className="mt-0.5 inline-block rounded-full bg-fuchsia-100 px-2 py-0.5 text-[11px] font-medium text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300">
            {item.category}
          </span>
        )}
      </div>

      <button
        onClick={() => onToggleFavorite(item.id)}
        aria-label={item.favorite ? "Unfavorite" : "Favorite"}
        className={`shrink-0 transition-transform hover:scale-110 ${
          item.favorite ? "text-amber-400" : "text-zinc-300 hover:text-zinc-400 dark:text-zinc-700"
        }`}
      >
        <StarIcon className="h-5 w-5" filled={item.favorite} />
      </button>

      <button
        onClick={() => setEditing(true)}
        aria-label="Edit"
        className="shrink-0 text-zinc-300 transition-colors hover:text-zinc-700 dark:text-zinc-700 dark:hover:text-zinc-200"
      >
        <PencilIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => onRemove(item.id)}
        aria-label="Delete"
        className="shrink-0 text-zinc-300 transition-colors hover:text-red-500 dark:text-zinc-700"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </motion.li>
  );
}
