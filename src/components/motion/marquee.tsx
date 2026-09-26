import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal ticker. The track holds two copies of the content and
 * translates by -50%, so the loop is seamless; hovering pauses it.
 *
 * Content is duplicated for visual continuity only — the copy is marked
 * `aria-hidden` so screen readers announce each item exactly once.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  speed = 42,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className={cn("mask-x-fade relative flex overflow-hidden", className)}>
      <div
        className={cn("marquee-track", reverse && "marquee-track-reverse")}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
