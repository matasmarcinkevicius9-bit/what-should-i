import type { Item, NewItemInput } from "./types";

const STORAGE_KEY = "what-should-i:items";

type Listener = () => void;

const EMPTY: Item[] = [];

let cache: Item[] = EMPTY;
let initialized = false;
const listeners = new Set<Listener>();

function readFromStorage(): Item[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Item[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: Item[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private browsing quota, etc.) — in-memory cache still works
  }
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  cache = readFromStorage();
  initialized = true;
}

function setCache(items: Item[]) {
  cache = items;
  writeToStorage(items);
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Item[] {
  ensureInitialized();
  return cache;
}

export function getServerSnapshot(): Item[] {
  return EMPTY;
}

export function addItem(input: NewItemInput) {
  const title = input.title.trim();
  if (!title) return;

  const item: Item = {
    id: crypto.randomUUID(),
    title,
    category: input.category?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    favorite: false,
    done: false,
    createdAt: Date.now(),
  };
  setCache([item, ...cache]);
}

export function updateItem(id: string, patch: Partial<Omit<Item, "id" | "createdAt">>) {
  setCache(cache.map((i) => (i.id === id ? { ...i, ...patch } : i)));
}

export function removeItem(id: string) {
  setCache(cache.filter((i) => i.id !== id));
}

export function toggleDone(id: string) {
  setCache(cache.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
}

export function toggleFavorite(id: string) {
  setCache(cache.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)));
}
