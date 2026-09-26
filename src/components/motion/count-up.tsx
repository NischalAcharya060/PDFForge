"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Counts up to `value` once the element scrolls into view.
 * Renders the final value on the server so the correct number is present
 * for crawlers and for users with JavaScript disabled.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1600,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(value);
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || hasRun.current) return;
    if (typeof IntersectionObserver === "undefined") return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // `display` already holds the final value, so honouring reduced motion
    // is simply a matter of not animating.
    if (reduced) {
      hasRun.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasRun.current) continue;
          hasRun.current = true;
          observer.disconnect();

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutExpo — fast start, long settle.
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplay(value * eased);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  const rounded =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {rounded}
      {suffix}
    </span>
  );
}
