import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { toolCategories, type ToolDefinition } from "@/config/tools";
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
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/85 p-5 sm:p-6 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        catMeta?.accentBorder,
        className,
      )}
    >
      {/* Subtle top category glow accent on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Top Header: Category Badge + Icon */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <span
            className={cn(
              "inline-flex size-12 items-center justify-center rounded-2xl border border-black/5 dark:border-white/5 transition-all duration-300 group-hover:scale-105 shadow-xs",
              catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-6 transition-transform duration-300 group-hover:rotate-3" aria-hidden="true" />
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.badgeText && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                {tool.badgeText}
              </span>
            )}
            {catMeta && (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
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
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span className="truncate pr-2">{tool.name}</span>
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom action */}
      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-end text-[11px] font-medium">
        <span className="font-semibold text-primary inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          Open tool
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export function ToolQuickLink({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  const catMeta = toolCategories[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-border/80 bg-card/85 p-3 sm:px-4 sm:py-3.5 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        catMeta?.accentBorder,
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/5 dark:border-white/5 transition-transform duration-300 group-hover:scale-110",
          catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-foreground group-hover:text-primary transition-colors text-xs sm:text-sm font-bold">
          {tool.shortName}
        </span>
        <span className="block text-[11px] font-normal text-muted-foreground truncate">
          {tool.category}
        </span>
      </div>
      <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary shrink-0" />
    </Link>
  );
}