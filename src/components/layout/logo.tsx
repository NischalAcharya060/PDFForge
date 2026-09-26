import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function ForgeMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="PDFForge Logo"
      width={40}
      height={40}
      priority
      aria-hidden="true"
      className={cn("size-10 shrink-0 object-contain", className)}
    />
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group/logo flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="PDFForge — home"
    >
      <span className="relative flex size-10 items-center justify-center">
        {/* Soft brand bloom that wakes up on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-primary/0 blur-lg transition-all duration-500 ease-[var(--ease-premium)] group-hover/logo:bg-primary/20"
        />
        <ForgeMark className="relative transition-transform duration-500 ease-[var(--ease-spring)] group-hover/logo:scale-110" />
      </span>

      {showWordmark ? (
        <span className="text-xl font-bold tracking-tight">
          PDF
          <span className="relative font-black text-primary">
            Forge
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-primary/50 transition-transform duration-500 ease-[var(--ease-expo)] group-hover/logo:scale-x-100"
            />
          </span>
        </span>
      ) : null}
    </Link>
  );
}
