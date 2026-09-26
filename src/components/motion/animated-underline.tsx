import { cn } from "@/lib/utils";

/**
 * Hand-drawn style squiggle that draws itself in beneath the text it wraps.
 *
 * Two details make it reliable at any font size or viewport:
 *
 * 1. The viewBox is normalised to `0 0 100 12` and the path runs edge to edge
 *    (0 -> 100). Combined with `preserveAspectRatio="none"` the stroke always
 *    reaches both ends of the text, so there is never a gap at the tail.
 * 2. Stroke weights are given in viewBox units, not CSS pixels. The box is
 *    `0.2em` tall, so 1 user unit is 1/60th of an em and a 3.3 unit stroke
 *    stays a constant 0.055em weight at every font size. Pinning it with
 *    `vector-effect: non-scaling-stroke` would make the line look twice as
 *    heavy on a 36px mobile headline as on a 72px desktop one.
 *
 * The draw animation is the `draw` keyframes (registered as `--animate-draw`),
 * which animate `stroke-dashoffset` from 1 to 0. `animation-fill-mode: both`
 * holds the stroke invisible during the delay, so it never flashes early on
 * first paint or on reload.
 */
export function AnimatedUnderline({
  children,
  className,
  delay = 0,
  duration = 700,
  strokeWidth = 3.3,
  haloWidth = 10,
  halo = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds to wait before the stroke starts drawing. */
  delay?: number;
  /** Draw duration in milliseconds. */
  duration?: number;
  /** Main stroke weight in viewBox units (1 unit = 1/60em). */
  strokeWidth?: number;
  /** Soft under-stroke weight in viewBox units, drawn beneath the main one. */
  haloWidth?: number;
  /** Render a wide translucent stroke beneath the main one for depth. */
  halo?: boolean;
}) {
  // Normalised to the 100-unit viewBox so the stroke touches both edges.
  const d = "M0 9C33.1 2.5 66.9 2.5 100 9";
  const timing = { animationDelay: `${delay}ms`, animationDuration: `${duration}ms` };

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.04em] h-[0.2em] w-full overflow-visible text-primary"
        viewBox="0 0 100 12"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {halo ? (
          <path
            className="animate-draw text-primary/20"
            d={d}
            stroke="currentColor"
            strokeWidth={haloWidth}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            style={timing}
          />
        ) : null}
        <path
          className="animate-draw text-primary/60"
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          style={timing}
        />
      </svg>
    </span>
  );
}
