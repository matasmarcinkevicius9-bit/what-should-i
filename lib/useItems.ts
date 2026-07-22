"use client";

import { useSyncExternalStore } from "react";
import * as store from "./itemsStore";

export function useItems() {
  const items = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return {
    items,
    addItem: store.addItem,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    toggleDone: store.toggleDone,
    toggleFavorite: store.toggleFavorite,
  };
}
