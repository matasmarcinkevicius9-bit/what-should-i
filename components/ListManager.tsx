"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { useItems } from "@/lib/useItems";
import { ItemRow } from "./ItemRow";
import { PlusIcon } from "./icons";

type Props = ReturnType<typeof useItems>;

export function ListManager({ items, addItem, updateItem, removeItem, toggleDone, toggleFavorite }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addItem({ title, category });
    setTitle("");
    setCategory("");
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ADD SOMETHING TO THE LIST…"
          className="hard-sm stamp min-w-0 flex-1 bg-[var(--panel)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40 [--shadow-c:var(--ink)]"
        />
        <div className="flex gap-3">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="CATEGORY"
            className="hard-sm stamp w-32 min-w-0 flex-1 bg-[var(--panel)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40 [--shadow-c:var(--ink)] sm:flex-none"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="hard-sm press-sm stamp flex shrink-0 items-center gap-1.5 bg-[var(--neon-lime)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--ink)]"
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </motion.button>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="hard stamp p-6 text-center text-sm text-[var(--ink)]/70 [--shadow-c:var(--neon-violet)]">
          Your list is empty. Add a few things above to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
                onToggleDone={toggleDone}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
