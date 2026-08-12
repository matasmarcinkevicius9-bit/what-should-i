import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function AboutPage() {
  return (
    <div className="flex flex-1 justify-center">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
        <Link
          href="/"
          className="stamp flex w-fit items-center gap-1.5 text-xs font-bold text-[var(--ink)]/70 hover:text-[var(--ink)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to list
        </Link>

        <div className="hard flex flex-col gap-4 bg-[var(--panel)] p-6 [--shadow-c:var(--neon-violet)]">
          <h1 className="font-display text-3xl uppercase tracking-wide text-[var(--ink)]">About This App</h1>
          <p className="text-sm text-[var(--ink)]/80">
            What Should I keeps a personal list of movies, meals, or anything else you can&apos;t
            decide on, then spins an animated wheel to pick one for you.
          </p>
        </div>
      </main>
    </div>
  );
}
