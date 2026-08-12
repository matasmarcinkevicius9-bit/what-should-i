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
      <li className="hard stamp flex flex-wrap items-center gap-2 bg-[var(--panel)] p-3 [--shadow-c:var(--neon-cyan)]">
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
          className="hard-sm min-w-0 flex-1 bg-[var(--paper)] px-2.5 py-1.5 text-sm text-[var(--ink)] outline-none [--shadow-c:var(--ink)]"
        />
        <input
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
          placeholder="category"
          className="hard-sm w-28 bg-[var(--paper)] px-2.5 py-1.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40 [--shadow-c:var(--ink)]"
        />
        <button
          onClick={saveEdit}
          className="hard-sm press-sm bg-[var(--neon-lime)] px-3 py-1.5 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--ink)]"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="stamp px-3 py-1.5 text-sm text-[var(--ink)]/60 hover:text-[var(--ink)]"
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
      className="hard press-sm group flex items-center gap-3 bg-[var(--panel)] p-3 [--shadow-c:var(--ink)]"
    >
      <button
        onClick={() => onToggleDone(item.id)}
        aria-label={item.done ? "Mark as not done" : "Mark as done"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center border-[2.5px] border-[var(--ink)] transition-colors ${
          item.done ? "bg-[var(--neon-lime)] text-[var(--ink)]" : "bg-[var(--panel)] text-transparent"
        }`}
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </button>

      <div className="min-w-0 flex-1">
        <Link
          href={`/items/${item.id}`}
          className={`block truncate text-sm font-bold text-[var(--ink)] hover:underline ${
            item.done ? "text-[var(--ink)]/40 line-through" : ""
          }`}
        >
          {item.title}
        </Link>
        {item.category && (
          <span className="stamp mt-1 inline-block border border-[var(--ink)] bg-[var(--neon-violet)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--ink)]">
            {item.category}
          </span>
        )}
      </div>

      <button
        onClick={() => onToggleFavorite(item.id)}
        aria-label={item.favorite ? "Unfavorite" : "Favorite"}
        className={`shrink-0 transition-transform hover:scale-110 ${
          item.favorite ? "text-[var(--neon-orange)]" : "text-[var(--ink)]/25 hover:text-[var(--ink)]/50"
        }`}
      >
        <StarIcon className="h-5 w-5" filled={item.favorite} />
      </button>

      <button
        onClick={() => setEditing(true)}
        aria-label="Edit"
        className="shrink-0 text-[var(--ink)]/25 transition-colors hover:text-[var(--neon-cyan)]"
      >
        <PencilIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => onRemove(item.id)}
        aria-label="Delete"
        className="shrink-0 text-[var(--ink)]/25 transition-colors hover:text-[var(--neon-pink)]"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </motion.li>
  );
}
