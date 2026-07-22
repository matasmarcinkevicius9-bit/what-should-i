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
      <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add something to the list…"
          className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-2">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="category (optional)"
            className="w-36 min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 dark:border-zinc-700 dark:bg-zinc-900 sm:flex-none"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm dark:bg-zinc-50 dark:text-zinc-900"
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </motion.button>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
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
