"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Item } from "@/lib/types";

type Props = {
  items: Item[];
  onToggleDone: (id: string) => void;
};

const SLICE_COLORS = [
  "#ff8800",
  "#39ff14",
  "#ff1744",
  "#00e5ff",
  "#faff00",
  "#ff00e5",
];

const FLAME_SLICE_COLORS = [
  "#ff4500",
  "#ff8c00",
  "#b22222",
  "#ffae00",
  "#8b0000",
  "#ff6f00",
];

const MAX_WHEEL_SIZE = 288;
const MIN_WHEEL_SIZE = 200;
const RIM_PADDING = 18;
const BULB_COUNT = 20;
const MIN_SPINS = 4;
const MAX_SPINS = 7;
const FAVORITE_WEIGHT = 3;
const DIVIDER_WIDTH_DEG = 0.8;

function weightOf(item: Item, invert: boolean) {
  const base = item.favorite ? FAVORITE_WEIGHT : 1;
  return invert ? FAVORITE_WEIGHT + 1 - base : base;
}

type Slice = { item: Item; start: number; size: number; mid: number };

function buildSlices(pool: Item[], invert: boolean): Slice[] {
  const totalWeight = pool.reduce((sum, i) => sum + weightOf(i, invert), 0);
  let cursor = 0;
  return pool.map((item) => {
    const size = totalWeight > 0 ? (weightOf(item, invert) / totalWeight) * 360 : 0;
    const start = cursor;
    cursor += size;
    return { item, start, size, mid: start + size / 2 };
  });
}

function buildDividerOverlay(slices: Slice[], color: string): string {
  if (slices.length < 2) return "none";
  const stops: string[] = [];
  let cursor = 0;
  for (const s of slices) {
    if (s.start > 0.01) {
      const a = s.start - DIVIDER_WIDTH_DEG / 2;
      const b = s.start + DIVIDER_WIDTH_DEG / 2;
      stops.push(`transparent ${cursor.toFixed(2)}deg`, `transparent ${a.toFixed(2)}deg`);
      stops.push(`${color} ${a.toFixed(2)}deg`, `${color} ${b.toFixed(2)}deg`);
      cursor = b;
    }
  }
  stops.push(`transparent ${cursor.toFixed(2)}deg`, `transparent 360deg`);
  return `conic-gradient(${stops.join(", ")})`;
}

function pickWeightedIndex(pool: Item[], invert: boolean) {
  const total = pool.reduce((sum, i) => sum + weightOf(i, invert), 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weightOf(pool[i], invert);
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

function colorForItem(item: Item | null, slices: Slice[], colors: string[]) {
  if (!item) return undefined;
  const index = slices.findIndex((s) => s.item.id === item.id);
  return colors[Math.max(0, index) % colors.length];
}

function celebrate(colors: string[], big: boolean) {
  confetti({
    particleCount: big ? 110 : 36,
    spread: big ? 75 : 50,
    startVelocity: big ? 38 : 24,
    origin: { y: 0.55 },
    colors,
    scalar: big ? 0.9 : 0.7,
  });
}

export function Picker({ items, onToggleDone }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Item | null>(null);
  const [wheelSize, setWheelSize] = useState(MAX_WHEEL_SIZE);
  const [duelMode, setDuelMode] = useState(false);
  const [duelPool, setDuelPool] = useState<Item[] | null>(null);
  const [lastEliminated, setLastEliminated] = useState<Item | null>(null);
  const [champion, setChampion] = useState<Item | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const available = (entries[0]?.contentRect.width ?? MAX_WHEEL_SIZE) - RIM_PADDING * 2 - 4;
      setWheelSize(Math.max(MIN_WHEEL_SIZE, Math.min(MAX_WHEEL_SIZE, available)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter((c): c is string => !!c))),
    [items]
  );

  const inCategory = category ? items.filter((i) => i.category === category) : items;
  const normalPool = inCategory.filter((i) => !i.done);

  const duelActivePool = useMemo(() => {
    if (!duelMode || !duelPool) return null;
    return duelPool.filter((d) => items.some((i) => i.id === d.id && !i.done));
  }, [duelMode, duelPool, items]);

  const pool = duelMode ? duelActivePool ?? [] : normalPool;
  const activeColors = duelMode ? FLAME_SLICE_COLORS : SLICE_COLORS;
  const slices = useMemo(() => buildSlices(pool, duelMode), [pool, duelMode]);
  const dividerOverlay = useMemo(
    () => buildDividerOverlay(slices, duelMode ? "rgba(25,0,0,0.6)" : "rgba(0,0,0,0.45)"),
    [slices, duelMode]
  );

  function spin() {
    if (spinning || pool.length === 0) return;
    if (duelMode && (pool.length < 2 || champion)) return;

    const targetIndex = pickWeightedIndex(pool, duelMode);
    const mid = slices[targetIndex].mid;
    const extraSpins = MIN_SPINS + Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1));

    const currentMod = ((rotation % 360) + 360) % 360;
    const targetMod = (360 - mid) % 360;
    const delta = (targetMod - currentMod + 360) % 360;

    setSpinning(true);
    setWinner(null);
    setLastEliminated(null);
    setRotation((prev) => prev + delta + extraSpins * 360);
  }

  function handleSpinEnd() {
    if (!spinning) return;
    setSpinning(false);
    const angle = (((360 - (rotation % 360)) % 360) + 360) % 360;
    const index = sliceIndexAtAngle(slices, angle);
    const picked = slices[index]?.item ?? null;
    if (!picked) return;

    if (duelMode) {
      const remaining = pool.filter((i) => i.id !== picked.id);
      setDuelPool(remaining);
      if (remaining.length <= 1) {
        setChampion(remaining[0] ?? picked);
        celebrate(FLAME_SLICE_COLORS, true);
      } else {
        setLastEliminated(picked);
        celebrate(FLAME_SLICE_COLORS, false);
      }
    } else {
      setWinner(picked);
      celebrate(SLICE_COLORS, true);
    }
  }

  function selectCategory(next: string | null) {
    if (spinning) return;
    setCategory(next);
    setWinner(null);
    if (duelMode) {
      const nextInCategory = next ? items.filter((i) => i.category === next) : items;
      setDuelPool(nextInCategory.filter((i) => !i.done));
      setChampion(null);
      setLastEliminated(null);
    }
  }

  function toggleDuelMode() {
    if (spinning) return;
    setWinner(null);
    setDuelMode((wasOn) => {
      const turningOn = !wasOn;
      setDuelPool(turningOn ? normalPool : null);
      setChampion(null);
      setLastEliminated(null);
      return turningOn;
    });
  }

  function restartDuel() {
    if (spinning) return;
    setDuelPool(normalPool);
    setChampion(null);
    setLastEliminated(null);
  }

  const winnerColor = colorForItem(winner, slices, activeColors);
  const championColor = colorForItem(champion, slices, FLAME_SLICE_COLORS);

  const spinLabel = spinning
    ? duelMode
      ? "Knocking out…"
      : "Spinning…"
    : duelMode
      ? champion
        ? "🏆 Duel won!"
        : pool.length < 2
          ? "Need 2+ to duel"
          : lastEliminated
            ? "Knock out next"
            : "Start the duel"
      : "Spin the wheel";

  const spinDisabled = spinning || pool.length === 0 || (duelMode && (pool.length < 2 || !!champion));

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.length > 0 && (
          <>
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
          </>
        )}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggleDuelMode}
          disabled={spinning}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            duelMode
              ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_0_12px_rgba(255,90,0,0.6)]"
              : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          🔥 Duel mode
        </motion.button>
      </div>

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
          <div
            className={`relative overflow-hidden rounded-full shadow-2xl ${
              duelMode
                ? "bg-gradient-to-br from-red-950 via-orange-950 to-black"
                : "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"
            }`}
            style={{
              width: wheelSize + RIM_PADDING * 2,
              height: wheelSize + RIM_PADDING * 2,
              boxShadow: duelMode
                ? "0 0 60px rgba(255,80,0,0.35), 0 20px 40px rgba(0,0,0,0.5)"
                : "0 0 50px rgba(255,255,255,0.12), 0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            {Array.from({ length: BULB_COUNT }).map((_, i) => {
              const bulbAngle = (360 / BULB_COUNT) * i;
              const cycleDuration = spinning ? (duelMode ? 0.45 : 0.7) : duelMode ? 1.1 : 2.2;
              return (
                <div
                  key={i}
                  className="pointer-events-none absolute inset-0"
                  style={{ transform: `rotate(${bulbAngle}deg)` }}
                >
                  <motion.div
                    className={`absolute left-1/2 -translate-x-1/2 rounded-full ${
                      duelMode ? "bg-orange-400" : "bg-white"
                    }`}
                    style={{
                      top: 4,
                      width: 8,
                      height: 8,
                      boxShadow: duelMode
                        ? "0 0 8px 3px rgba(255,120,0,0.9), 0 0 20px 8px rgba(255,60,0,0.5)"
                        : "0 0 6px 2px rgba(255,255,255,0.9), 0 0 16px 6px rgba(255,255,255,0.45)",
                    }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: cycleDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (i / BULB_COUNT) * cycleDuration,
                    }}
                  />
                </div>
              );
            })}

            {duelMode && (
              <div className="pointer-events-none absolute inset-0 z-30">
                {[0, 90, 180, 270].map((deg) => (
                  <motion.span
                    key={deg}
                    className="absolute left-1/2 top-1/2 text-lg"
                    style={{
                      transform: `rotate(${deg}deg) translate(0, -${wheelSize / 2 + RIM_PADDING + 6}px)`,
                    }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.15, 0.9] }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: deg / 720,
                    }}
                  >
                    🔥
                  </motion.span>
                ))}
              </div>
            )}

            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: wheelSize, height: wheelSize }}
            >
              <div className="relative h-full w-full">
                <div
                  className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: duelMode ? "16px solid #ff5500" : "16px solid #f5f5f5",
                    filter: duelMode
                      ? "drop-shadow(0 0 8px rgba(255,80,0,0.9)) drop-shadow(0 2px 3px rgba(0,0,0,0.6))"
                      : "drop-shadow(0 0 6px rgba(255,255,255,0.8)) drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
                  }}
                />

                <motion.div
                  className="h-full w-full overflow-hidden rounded-full shadow-inner"
                  style={{
                    backgroundImage: `${dividerOverlay}, conic-gradient(${slices
                      .map(
                        (s, i) =>
                          `${activeColors[i % activeColors.length]} ${s.start.toFixed(2)}deg ${(
                            s.start + s.size
                          ).toFixed(2)}deg`
                      )
                      .join(", ")})`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                    filter: "saturate(1.35) brightness(1.05)",
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
                        className={`absolute left-1/2 top-3 truncate rounded-full px-2 py-0.5 text-center text-[11px] font-semibold tracking-wide text-white ${
                          duelMode ? "bg-black/60 ring-1 ring-orange-500/40" : "bg-black/45"
                        }`}
                        style={{
                          width: wheelSize / 2 - 46,
                          transform: `translateX(-50%) ${s.mid > 90 && s.mid < 270 ? "rotate(180deg)" : ""}`,
                        }}
                      >
                        {s.item.favorite ? "★ " : ""}
                        {s.item.title}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <div
                  className={`absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 ${
                    duelMode
                      ? "border-orange-200 bg-gradient-to-br from-red-600 to-orange-700 dark:border-orange-300"
                      : "border-white bg-gradient-to-br from-zinc-700 to-zinc-900 dark:border-zinc-900 dark:from-zinc-100 dark:to-zinc-300"
                  }`}
                  style={{
                    boxShadow: duelMode
                      ? "0 0 14px 3px rgba(255,100,0,0.8)"
                      : "0 0 10px 2px rgba(255,255,255,0.7)",
                  }}
                />
              </div>
            </div>
          </div>

          {duelMode && lastEliminated && !champion && !spinning && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-orange-600 dark:text-orange-400"
            >
              🔥 <strong>{lastEliminated.title}</strong> is knocked out — {pool.length} left
            </motion.p>
          )}

          <motion.button
            whileHover={spinDisabled ? {} : { scale: 1.05 }}
            whileTap={spinDisabled ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={spin}
            disabled={spinDisabled}
            className={`rounded-full px-6 py-2 text-sm font-medium shadow-md disabled:opacity-50 ${
              duelMode
                ? "bg-gradient-to-r from-red-600 to-orange-500 text-white"
                : "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
            }`}
          >
            {spinLabel}
          </motion.button>
        </>
      )}

      <AnimatePresence>
        {winner && !spinning && !duelMode && (
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

        {champion && !spinning && duelMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              boxShadow: `0 0 0 1px ${championColor}55, 0 0 40px -4px ${championColor}aa, 0 12px 32px -8px rgba(0,0,0,0.5)`,
            }}
            className="flex flex-col items-center gap-3 rounded-xl border border-orange-500/40 bg-gradient-to-b from-zinc-900 to-black p-5 text-center"
          >
            <p className="text-xs uppercase tracking-wide text-orange-400">🏆 Duel champion</p>
            <Link
              href={`/items/${champion.id}`}
              className="text-xl font-semibold text-white hover:underline"
            >
              {champion.title}
            </Link>
            {champion.category && <span className="text-xs text-orange-200/70">{champion.category}</span>}
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => onToggleDone(champion.id)}
                className="rounded-md border border-orange-500/40 px-3 py-1 text-xs font-medium text-orange-100 hover:bg-orange-500/10"
              >
                Mark as done
              </button>
              <button
                onClick={restartDuel}
                className="rounded-md border border-orange-500/40 px-3 py-1 text-xs font-medium text-orange-100 hover:bg-orange-500/10"
              >
                🔁 New duel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
