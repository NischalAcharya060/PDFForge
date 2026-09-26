"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A hairline reading-progress bar pinned to the top of the viewport.
 * Rendered once in the root layout; purely decorative and non-interactive.
 */
export function ScrollProgress() {
  const barRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;

      const bar = barRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${progress})`;
      }
      setVisible(window.scrollY > 24);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left",
        "transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary/40 via-primary to-primary/40 will-change-transform"
        style={{ transition: "transform 120ms linear" }}
      />
    </div>
  );
}
