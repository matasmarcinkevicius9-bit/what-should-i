import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <main
        className="hard flex w-full max-w-md flex-col items-center gap-4 bg-[#0b0b0c] px-6 py-16 text-center [--shadow-c:var(--neon-pink)]"
        style={{ borderColor: "var(--neon-pink)" }}
      >
        <span className="font-sign neon-text text-6xl text-[var(--neon-pink)] [--glow-c:var(--neon-pink)]">
          404
        </span>
        <h1 className="font-display text-xl uppercase tracking-wide text-[#f2ede0]">
          This page spun off the wheel
        </h1>
        <p className="text-sm text-[#f2ede0]/60">
          The page you&apos;re looking for was moved, deleted, or never existed.
        </p>
        <Link
          href="/"
          className="hard-sm press-sm stamp mt-2 flex items-center gap-1.5 bg-[var(--neon-lime)] px-5 py-2.5 text-sm font-bold text-[var(--ink)] [--shadow-c:var(--neon-cyan)]"
          style={{ borderColor: "var(--ink)" }}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to the wheel
        </Link>
      </main>
    </div>
  );
}
