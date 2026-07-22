const STORAGE_KEY = "what-should-i:theme";

type Theme = "light" | "dark";
type Listener = () => void;

let theme: Theme = "light";
let initialized = false;
const listeners = new Set<Listener>();

function readInitialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // storage unavailable — fall back to system preference below
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  theme = readInitialTheme();
  applyTheme(theme);
  initialized = true;
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Theme {
  ensureInitialized();
  return theme;
}

export function getServerSnapshot(): Theme {
  return "light";
}

export function toggleTheme() {
  ensureInitialized();
  theme = theme === "dark" ? "light" : "dark";
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable — theme still applies for this session
  }
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}
