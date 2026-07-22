"use client";

import { useItems } from "@/lib/useItems";
import { ListManager } from "@/components/ListManager";
import { Picker } from "@/components/Picker";

export default function Home() {
  const itemsState = useItems();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.10),rgba(255,255,255,0))] dark:bg-black dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.16),rgba(0,0,0,0))]">
      <main className="flex w-full max-w-2xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-1">
          <h1 className="bg-gradient-to-r from-emerald-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            🎡 What Should I
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Keep a list, then let the wheel decide.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Pick for me
          </span>
          <Picker items={itemsState.items} onToggleDone={itemsState.toggleDone} />
        </section>

        <section className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Your list
          </span>
          <ListManager {...itemsState} />
        </section>
      </main>
    </div>
  );
}
