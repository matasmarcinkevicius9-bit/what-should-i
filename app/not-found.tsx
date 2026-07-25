import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.10),rgba(255,255,255,0))] dark:bg-black dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.16),rgba(0,0,0,0))]">
      <main className="flex w-full max-w-md flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="bg-gradient-to-r from-emerald-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent">
          404
        </span>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          This page spun off the wheel
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          The page you&apos;re looking for was moved, deleted, or never existed.
        </p>
        <Link
          href="/"
          className="mt-2 flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to the wheel
        </Link>
      </main>
    </div>
  );
}
