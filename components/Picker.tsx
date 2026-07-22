"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
const DIVIDER_WIDTH_DEG = 0.6;

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

function buildDividerOverlay(slices: Slice[]): string {
  if (slices.length < 2) return "none";
  const stops: string[] = [];
  let cursor = 0;
  for (const s of slices) {
    if (s.start > 0.01) {
      const a = s.start - DIVIDER_WIDTH_DEG / 2;
      const b = s.start + DIVIDER_WIDTH_DEG / 2;
      stops.push(`transparent ${cursor.toFixed(2)}deg`, `transparent ${a.toFixed(2)}deg`);
      stops.push(`rgba(255,255,255,0.85) ${a.toFixed(2)}deg`, `rgba(255,255,255,0.85) ${b.toFixed(2)}deg`);
      cursor = b;
    }
  }
  stops.push(`transparent ${cursor.toFixed(2)}deg`, `transparent 360deg`);
  return `conic-gradient(${stops.join(", ")})`;
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

function celebrate() {
  confetti({
    particleCount: 110,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.55 },
    colors: SLICE_COLORS,
    scalar: 0.9,
  });
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
  const dividerOverlay = useMemo(() => buildDividerOverlay(slices), [slices]);

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
    const picked = slices[index]?.item ?? null;
    setWinner(picked);
    if (picked) celebrate();
  }

  function selectCategory(next: string | null) {
    if (spinning) return;
    setCategory(next);
    setWinner(null);
  }

  const winnerColor = winner
    ? SLICE_COLORS[Math.max(0, slices.findIndex((s) => s.item.id === winner.id)) % SLICE_COLORS.length]
    : undefined;

  return (
    <div className="flex flex-col items-center gap-6">
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => selectCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              category === null
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            All
          </motion.button>
          {categories.map((c) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.94 }}
              onClick={() => selectCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                category === c
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {c}
            </motion.button>
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
          <div className="rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 p-3 shadow-xl dark:from-zinc-800 dark:to-zinc-950">
            <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
              <div
                className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "16px solid var(--foreground)",
                  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))",
                }}
              />

              <motion.div
                className="h-full w-full rounded-full shadow-inner"
                style={{
                  backgroundImage: `${dividerOverlay}, conic-gradient(${slices
                    .map(
                      (s, i) =>
                        `${SLICE_COLORS[i % SLICE_COLORS.length]} ${s.start.toFixed(2)}deg ${(
                          s.start + s.size
                        ).toFixed(2)}deg`
                    )
                    .join(", ")})`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
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

              <div className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-md dark:border-zinc-900 dark:from-zinc-100 dark:to-zinc-300" />
            </div>
          </div>

          <motion.button
            whileHover={spinning ? {} : { scale: 1.05 }}
            whileTap={spinning ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={spin}
            disabled={spinning}
            className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white shadow-md disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {spinning ? "Spinning…" : "Spin the wheel"}
          </motion.button>
        </>
      )}

      <AnimatePresence>
        {winner && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={winnerColor ? { boxShadow: `0 0 0 1px ${winnerColor}33, 0 12px 32px -8px ${winnerColor}66` } : undefined}
            className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">🎉 You should</p>
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
