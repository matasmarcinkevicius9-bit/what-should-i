"use client";

import { useItems } from "@/lib/useItems";
import { ListManager } from "@/components/ListManager";
import { Picker } from "@/components/Picker";

export default function Home() {
  const itemsState = useItems();

  return (
    <div className="flex flex-1 justify-center">
      <main className="flex w-full max-w-2xl flex-col gap-10 px-6 py-16">
        <header
          className="hard sign-flicker relative overflow-hidden bg-[#0b0b0c] px-6 py-8 text-center [--shadow-c:var(--neon-pink)]"
          style={{ borderColor: "var(--neon-pink)" }}
        >
          <span className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-[#52525b]" />
          <span className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#52525b]" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 rounded-full bg-[#52525b]" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full bg-[#52525b]" />
          <h1 className="font-sign neon-text text-3xl leading-relaxed text-[var(--neon-pink)] sm:text-4xl [--glow-c:var(--neon-pink)]">
            What Should I
          </h1>
          <p className="stamp mt-2 text-xs text-[var(--neon-cyan)] [--glow-c:var(--neon-cyan)]">
            keep a list. spin the wheel. no take-backs.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <span className="hard-sm stamp inline-block w-fit bg-[var(--neon-lime)] px-2.5 py-1 text-xs font-bold text-[var(--ink)] [--shadow-c:var(--ink)]">
            Pick for me
          </span>
          <Picker items={itemsState.items} onToggleDone={itemsState.toggleDone} />
        </section>

        <section className="flex flex-col gap-4">
          <span className="hard-sm stamp inline-block w-fit bg-[var(--neon-cyan)] px-2.5 py-1 text-xs font-bold text-[var(--ink)] [--shadow-c:var(--ink)]">
            Your list
          </span>
          <ListManager {...itemsState} />
        </section>
      </main>
    </div>
  );
}
