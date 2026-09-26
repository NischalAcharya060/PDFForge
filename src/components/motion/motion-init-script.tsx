/**
 * Inline pre-paint script that flags the document as JS-capable.
 *
 * Scroll-reveal styles are gated behind `.motion-ready` so that when
 * JavaScript is unavailable, content renders fully visible instead of being
 * stranded in its pre-animation state. This must run before first paint.
 */
export function MotionInitScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.classList.add("motion-ready");`,
      }}
    />
  );
}
