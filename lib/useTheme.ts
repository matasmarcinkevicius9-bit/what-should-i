"use client";

import { useSyncExternalStore } from "react";
import * as store from "./themeStore";

export function useTheme() {
  const theme = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return { theme, toggleTheme: store.toggleTheme };
}
