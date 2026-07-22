"use client";

import { useItems } from "@/lib/useItems";
import { ListManager } from "@/components/ListManager";
import { Picker } from "@/components/Picker";

export default function Home() {
  const itemsState = useItems();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            What Should I
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Keep a list, then let the wheel decide.
          </p>
        </header>

        <Picker items={itemsState.items} onToggleDone={itemsState.toggleDone} />

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        <ListManager {...itemsState} />
      </main>
    </div>
  );
}
