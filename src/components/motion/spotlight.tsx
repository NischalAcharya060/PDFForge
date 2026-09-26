"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Adds a cursor-tracked radial highlight to its child.
 * The pointer position is written to `--mx` / `--my` CSS variables which
 * the `.spotlight` class renders as a soft brand-tinted bloom.
 *
 * Purely decorative — pointer events and layout are untouched.
 */
export function Spotlight({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null);

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      node.style.setProperty("--my", `${event.clientY - rect.top}px`);
    },
    [],
  );

  const handlePointerLeave = React.useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--mx", "50%");
    node.style.setProperty("--my", "50%");
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("spotlight relative isolate", className)}
      {...props}
    >
      {children}
    </div>
  );
}
