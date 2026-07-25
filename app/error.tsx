"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.10),rgba(255,255,255,0))] dark:bg-black dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.16),rgba(0,0,0,0))]">
      <main className="flex w-full max-w-md flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="text-5xl">🎡💥</span>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Something knocked the wheel over
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          An unexpected error happened. You can try again, or head back to the wheel.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => unstable_retry()}
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to the wheel
          </Link>
        </div>
      </main>
    </div>
  );
}
