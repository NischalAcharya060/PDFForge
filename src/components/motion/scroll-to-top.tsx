"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
/** Scroll distance (px) before the control appears. */
const REVEAL_AT = 320;

/**
 * Floating "back to top" control with a circular reading-progress ring.
 * Rendered once in the root layout.
 *
 * Accessibility notes:
 * - While hidden it is removed from the tab order and the a11y tree, so
 *   keyboard and screen-reader users never land on an invisible button.
 * - `prefers-reduced-motion` is checked explicitly because the CSS override
 *   of `scroll-behavior` does not affect `scrollTo({ behavior: "smooth" })`.
 */
export function ScrollToTop() {
  const ringRef = React.useRef<SVGCircleElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;

      setVisible(window.scrollY > REVEAL_AT);

      // Written straight to the DOM: routing this through state would re-render
      // the component on every scroll frame.
      const ring = ringRef.current;
      if (ring) {
        ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
      }
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

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group fixed right-4 z-[55] grid size-13 place-items-center rounded-full sm:right-6 sm:size-14",
        "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
        "border border-border/80 bg-card/85 text-foreground shadow-premium-lg backdrop-blur-xl",
        "transition-[opacity,transform,border-color,box-shadow] duration-300 ease-[var(--ease-premium)]",
        "hover:border-primary/45 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "press",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70% 70% at 50% 0%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 72%)",
        }}
      />

      {/* Progress ring: circumference is normalised, so only the offset moves. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 52 52"
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="26"
          cy="26"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2"
          className="stroke-border/70"
        />
        <circle
          ref={ringRef}
          cx="26"
          cy="26"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE}
          className="stroke-primary transition-[stroke-dashoffset] duration-150 ease-linear"
        />
      </svg>

      <ArrowUp
        aria-hidden="true"
        className={cn(
          "relative size-5 transition-transform duration-300 ease-[var(--ease-spring)]",
          "group-hover:-translate-y-0.5",
        )}
      />
    </button>
  );
}
