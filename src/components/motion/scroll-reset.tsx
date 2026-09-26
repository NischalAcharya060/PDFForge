"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Guarantees a cross-route navigation starts at the top of the new page.
 *
 * Why this is needed: `html` has `scroll-behavior: smooth` (globals.css), which
 * turns Next.js's own scroll-to-top into an *animated* scroll. The incoming
 * page mounts at its full height and then reflows while that animation is in
 * flight, so the browser can settle at a non-zero offset — e.g. clicking the
 * logo on /download could land part-way down the homepage instead of on the
 * hero. Forcing an instant jump removes the race.
 *
 * Two cases are deliberately left alone:
 * - The first render, so reloads keep the browser's restored position and URLs
 *   with a hash still land on their anchor.
 * - Back/forward (POP) navigations, so the browser's own scroll restoration
 *   continues to work.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const isFirstRender = React.useRef(true);
  const isPopNavigation = React.useRef(false);

  // Registered before the reset effect below (effects run in declaration
  // order), so the flag is already set when a POP changes the pathname.
  React.useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }
    // "instant" rather than "auto": "auto" defers to the CSS
    // `scroll-behavior: smooth`, which is the behaviour being corrected here.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
