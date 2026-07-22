"use client";

import { useState } from "react";
import type { useItems } from "@/lib/useItems";
import { ItemRow } from "./ItemRow";

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
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add something to the list…"
          className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="category (optional)"
          className="w-36 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Your list is empty. Add a few things above to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
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
        </ul>
      )}
    </div>
  );
}
