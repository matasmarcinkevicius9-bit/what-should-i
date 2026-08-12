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
    <div className="flex flex-1 items-center justify-center">
      <main
        className="hard flex w-full max-w-md flex-col items-center gap-4 bg-[#0b0b0c] px-6 py-16 text-center [--shadow-c:var(--neon-orange)]"
        style={{ borderColor: "var(--neon-orange)" }}
      >
        <span className="text-5xl">🎡💥</span>
        <h1 className="font-display text-xl uppercase tracking-wide text-[#f2ede0]">
          Something knocked the wheel over
        </h1>
        <p className="text-sm text-[#f2ede0]/60">
          An unexpected error happened. You can try again, or head back to the wheel.
        </p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={() => unstable_retry()}
            className="hard-sm press-sm stamp bg-[#0b0b0c] px-5 py-2.5 text-sm font-bold text-[#f2ede0] [--shadow-c:var(--neon-orange)]"
            style={{ borderColor: "var(--neon-orange)" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="hard-sm press-sm stamp flex items-center gap-1.5 bg-[var(--neon-lime)] px-5 py-2.5 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--neon-cyan)]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to the wheel
          </Link>
        </div>
      </main>
    </div>
  );
}
