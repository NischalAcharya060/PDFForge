"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealElement = React.ElementRef<keyof React.JSX.IntrinsicElements>;

/**
 * A single IntersectionObserver is shared across every Reveal instance so
 * long pages with dozens of animated blocks stay cheap.
 */
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const fire = callbacks.get(entry.target);
        if (fire) {
          fire();
          callbacks.delete(entry.target);
        }
        sharedObserver?.unobserve(entry.target);
      }
    },
    {
      // Fire slightly before the element is fully on screen so the
      // animation is already underway by the time it settles into view.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08,
    },
  );

  return sharedObserver;
}

const VISIBLE = "reveal-visible";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger offset in milliseconds. */
  delay?: number;
  /** Vertical travel distance in pixels (default 26). */
  y?: number;
  /** Horizontal travel distance in pixels. */
  x?: number;
  /** Starting scale (values < 1 grow in). */
  scale?: number;
  /** Starting blur radius in pixels. */
  blur?: number;
  /** Delay before the reveal is allowed to run, for hero choreography. */
  initialDelay?: number;
}

function buildStyle({
  delay,
  y,
  x,
  scale,
  blur,
}: Pick<RevealProps, "delay" | "y" | "x" | "scale" | "blur">) {
  return {
    "--reveal-delay": `${delay ?? 0}ms`,
    "--reveal-x": `${x ?? 0}px`,
    "--reveal-y": `${y === undefined ? 26 : y}px`,
    "--reveal-scale": String(scale ?? 1),
    "--reveal-blur": `${blur ?? 0}px`,
  } as React.CSSProperties;
}

/**
 * Animates its children in when the block scrolls into view.
 *
 * Visibility is toggled imperatively on the DOM node rather than through
 * React state, so revealing never re-renders the subtree. The hidden start
 * state is gated behind `.motion-ready`, so content is fully visible when
 * JavaScript is unavailable, and a global `prefers-reduced-motion` rule
 * neutralises the animation.
 */
export function Reveal({
  children,
  className,
  delay,
  y,
  x,
  scale,
  blur,
  initialDelay = 0,
  style,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = getObserver();
    if (!observer) {
      node.classList.add(VISIBLE);
      return;
    }

    const show = () => node.classList.add(VISIBLE);
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Elements already within the first viewport reveal on mount, so the
    // hero animates immediately instead of waiting for a scroll.
    const alreadyInView =
      node.getBoundingClientRect().top < window.innerHeight * 0.92;

    if (alreadyInView && initialDelay > 0) {
      timer = setTimeout(show, initialDelay);
    } else {
      callbacks.set(node, show);
      observer.observe(node);
    }

    return () => {
      if (timer) clearTimeout(timer);
      callbacks.delete(node);
      observer.unobserve(node);
    };
  }, [initialDelay]);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={cn("reveal", className)}
      style={{ ...buildStyle({ delay, y, x, scale, blur }), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Reveals a container and staggers each direct child in sequence.
 * Intended for card grids and lists.
 */
export function RevealGroup({
  children,
  className,
  step = 70,
  y = 18,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { step?: number; y?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Assign each child its own delay so the sequence length is not capped
    // by a fixed nth-child ladder in CSS. Capped so long grids do not take
    // seconds to finish revealing.
    const kids = Array.from(node.children) as HTMLElement[];
    kids.forEach((kid, index) => {
      kid.style.setProperty("--reveal-delay", `${Math.min(index * step, 640)}ms`);
      kid.style.setProperty("--reveal-y", `${y}px`);
    });

    const observer = getObserver();
    if (!observer) {
      node.classList.add(VISIBLE);
      return;
    }

    const show = () => node.classList.add(VISIBLE);
    callbacks.set(node, show);
    observer.observe(node);

    return () => {
      callbacks.delete(node);
      observer.unobserve(node);
    };
  }, [step, y]);

  return (
    <div
      ref={ref}
      className={cn("reveal-stagger", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Reveals a headline word by word with a rising, blurred entrance.
 * Used for hero titles only.
 */
export function RevealWords({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={cn("inline", className)}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
          >
            <span
              className={cn(
                "inline-block animate-fade-up will-change-transform",
                wordClassName,
              )}
              style={{ animationDelay: `${delay + index * step}ms` }}
            >
              {word}
            </span>
          </span>
          {/* The gap must live outside the clipping wrapper: whitespace at the
              trailing edge of an inline-block collapses and the words would
              otherwise run together. */}
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

export type { RevealElement };
