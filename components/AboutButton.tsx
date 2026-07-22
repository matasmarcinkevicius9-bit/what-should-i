import Link from "next/link";
import { InfoIcon } from "@/components/icons";

export function AboutButton() {
  return (
    <Link
      href="/about"
      aria-label="About this app"
      className="fixed left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <InfoIcon className="h-5 w-5" />
    </Link>
  );
}
