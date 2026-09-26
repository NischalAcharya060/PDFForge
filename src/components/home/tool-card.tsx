import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { toolCategories, type ToolDefinition } from "@/config/tools";
import { Spotlight } from "@/components/motion/spotlight";
import { cn } from "@/lib/utils";

export function ToolCard({
  tool,
  className,
}: {
  tool: ToolDefinition;
  className?: string;
}) {
  const Icon = tool.icon;
  const catMeta = toolCategories[tool.category];

  return (
    <Spotlight
      className={cn(
        "group/card lift border-gradient-hover h-full rounded-2xl border border-border/80 bg-card/85 shadow-xs backdrop-blur-sm focus-within:border-primary/50",
        catMeta?.accentBorder,
        className,
      )}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="relative z-10 flex h-full flex-col justify-between rounded-2xl p-5 outline-none sm:p-6"
      >
        {/* Hairline accent that wipes in across the top edge on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-500 ease-[var(--ease-expo)] group-hover/card:scale-x-100"
        />

        <div>
          {/* Top Header: Icon tile + badges */}
          <div className="mb-4 flex items-start justify-between gap-2">
            <span
              className={cn(
                "relative inline-flex size-12 items-center justify-center overflow-hidden rounded-2xl border border-black/5 shadow-xs transition-all duration-500 ease-[var(--ease-spring)] group-hover/card:-translate-y-0.5 group-hover/card:scale-110 dark:border-white/5",
                catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
              )}
            >
              <Icon
                className="size-6 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/card:scale-110"
                aria-hidden="true"
              />
            </span>

            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {tool.badgeText && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                  {tool.badgeText}
                </span>
              )}
              {catMeta && (
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-opacity duration-300",
                    catMeta.badgeClass,
                  )}
                >
                  {tool.category}
                </span>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h3 className="flex items-center justify-between text-base font-bold tracking-tight text-foreground transition-colors duration-300 group-hover/card:text-primary sm:text-lg">
              <span className="truncate pr-2">{tool.name}</span>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-primary"
                aria-hidden="true"
              />
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Bottom action — the label slides forward with the arrow. */}
        <div className="mt-5 flex items-center justify-end border-t border-border/60 pt-3.5 text-[11px] font-medium">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Open tool
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-[var(--ease-expo)] group-hover/card:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </Spotlight>
  );
}

export function ToolQuickLink({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  const catMeta = toolCategories[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group/quick lift glass flex items-center gap-3 rounded-2xl border border-border/80 p-3 text-sm font-semibold shadow-xs outline-none sm:px-4 sm:py-3.5 focus-visible:border-primary/50",
        catMeta?.accentBorder,
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/quick:scale-110 dark:border-white/5",
          catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold text-foreground transition-colors duration-300 group-hover/quick:text-primary sm:text-sm">
          {tool.shortName}
        </span>
        <span className="block truncate text-[11px] font-normal text-muted-foreground">
          {tool.category}
        </span>
      </div>
      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover/quick:-translate-y-0.5 group-hover/quick:translate-x-0.5 group-hover/quick:text-primary" />
    </Link>
  );
}
