"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Item } from "@/lib/types";

type Props = {
  items: Item[];
  onToggleDone: (id: string) => void;
};

const SLICE_COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#2dd4bf",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
];

const WHEEL_SIZE = 288;
const MIN_SPINS = 4;
const MAX_SPINS = 7;
const FAVORITE_WEIGHT = 3;

function weightOf(item: Item) {
  return item.favorite ? FAVORITE_WEIGHT : 1;
}

type Slice = { item: Item; start: number; size: number; mid: number };

function buildSlices(pool: Item[]): Slice[] {
  const totalWeight = pool.reduce((sum, i) => sum + weightOf(i), 0);
  let cursor = 0;
  return pool.map((item) => {
    const size = totalWeight > 0 ? (weightOf(item) / totalWeight) * 360 : 0;
    const start = cursor;
    cursor += size;
    return { item, start, size, mid: start + size / 2 };
  });
}

function pickWeightedIndex(pool: Item[]) {
  const total = pool.reduce((sum, i) => sum + weightOf(i), 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weightOf(pool[i]);
    if (r <= 0) return i;
  }
  return pool.length - 1;
}

function sliceIndexAtAngle(slices: Slice[], angle: number) {
  let acc = 0;
  for (let i = 0; i < slices.length; i++) {
    acc += slices[i].size;
    if (angle < acc + 0.001) return i;
  }
  return slices.length - 1;
}

export function Picker({ items, onToggleDone }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Item | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter((c): c is string => !!c))),
    [items]
  );

  const inCategory = category ? items.filter((i) => i.category === category) : items;
  const pool = inCategory.filter((i) => !i.done);
  const slices = useMemo(() => buildSlices(pool), [pool]);

  function spin() {
    if (spinning || pool.length === 0) return;

    const winnerIndex = pickWeightedIndex(pool);
    const mid = slices[winnerIndex].mid;
    const extraSpins = MIN_SPINS + Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1));

    const currentMod = ((rotation % 360) + 360) % 360;
    const targetMod = (360 - mid) % 360;
    const delta = (targetMod - currentMod + 360) % 360;

    setSpinning(true);
    setWinner(null);
    setRotation((prev) => prev + delta + extraSpins * 360);
  }

  function handleSpinEnd() {
    if (!spinning) return;
    setSpinning(false);
    const angle = (((360 - (rotation % 360)) % 360) + 360) % 360;
    const index = sliceIndexAtAngle(slices, angle);
    setWinner(slices[index]?.item ?? null);
  }

  function selectCategory(next: string | null) {
    if (spinning) return;
    setCategory(next);
    setWinner(null);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => selectCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              category === null
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => selectCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                category === c
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {pool.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            {items.length === 0
              ? "Add something to your list, then spin to let it decide."
              : inCategory.length === 0
                ? `Nothing in "${category}" yet — add an item with that category or pick another.`
                : "Everything here is marked done — add something new or un-mark an item to spin again."}
          </p>
        </div>
      ) : (
        <>
          <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
            <div
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "16px solid var(--foreground)",
              }}
            />

            <motion.div
              className="h-full w-full rounded-full shadow-lg"
              style={{
                background: `conic-gradient(${slices
                  .map(
                    (s, i) =>
                      `${SLICE_COLORS[i % SLICE_COLORS.length]} ${s.start.toFixed(2)}deg ${(
                        s.start + s.size
                      ).toFixed(2)}deg`
                  )
                  .join(", ")})`,
              }}
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.17, 0.67, 0.16, 0.99] }}
              onAnimationComplete={handleSpinEnd}
            >
              {slices.map((s) => (
                <div
                  key={s.item.id}
                  className="pointer-events-none absolute inset-0"
                  style={{ transform: `rotate(${s.mid}deg)` }}
                >
                  <div
                    className="absolute left-1/2 top-3.5 truncate text-center text-xs font-semibold text-white/90"
                    style={{
                      width: WHEEL_SIZE / 2 - 40,
                      transform: `translateX(-50%) ${s.mid > 90 && s.mid < 270 ? "rotate(180deg)" : ""}`,
                    }}
                  >
                    {s.item.favorite ? "★ " : ""}
                    {s.item.title}
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 dark:border-zinc-900 dark:bg-zinc-50" />
          </div>

          <button
            onClick={spin}
            disabled={spinning}
            className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
        </>
      )}

      <AnimatePresence>
        {winner && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">You should</p>
            <Link
              href={`/items/${winner.id}`}
              className="text-xl font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
            >
              {winner.title}
            </Link>
            {winner.category && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{winner.category}</span>
            )}
            <button
              onClick={() => onToggleDone(winner.id)}
              className="mt-1 rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Mark as done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
