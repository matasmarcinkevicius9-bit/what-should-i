import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function AboutPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.10),rgba(255,255,255,0))] dark:bg-black dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(217,70,239,0.16),rgba(0,0,0,0))]">
      <main className="flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to list
        </Link>

        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About This App</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            What Should I keeps a personal list of movies, meals, or anything else you can&apos;t
            decide on, then spins an animated wheel to pick one for you.
          </p>
        </div>
      </main>
    </div>
  );
}
