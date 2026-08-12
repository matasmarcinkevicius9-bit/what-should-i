import Link from "next/link";
import { InfoIcon } from "@/components/icons";

export function AboutButton() {
  return (
    <Link
      href="/about"
      aria-label="About this app"
      className="hard press-sm fixed left-4 top-4 z-20 flex h-11 w-11 items-center justify-center text-[var(--ink)] [--shadow-c:var(--neon-pink)]"
    >
      <InfoIcon className="h-5 w-5" />
    </Link>
  );
}
