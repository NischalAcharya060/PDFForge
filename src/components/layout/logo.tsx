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

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="PDFForge — home"
    >
      <ForgeMark />
      <span className="text-xl font-bold tracking-tight">
        PDF<span className="text-primary font-black">Forge</span>
      </span>
    </Link>
  );
}