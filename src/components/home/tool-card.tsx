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
        "group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        catMeta?.accentBorder,
        className,
      )}
    >
      <div>
        {/* Top Header: Category Badge + Icon */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <span
            className={cn(
              "inline-flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-xs",
              catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-6" aria-hidden="true" />
          </span>

          <div className="flex items-center gap-1.5">
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
          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span>{tool.name}</span>
            <ArrowUpRight
              className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary shrink-0"
              aria-hidden="true"
            />
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground/80 font-medium">
        <span>100% In-Browser</span>
        <span className="text-primary font-semibold group-hover:underline">Open tool →</span>
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
        "group flex items-center gap-3 rounded-xl border bg-card/80 px-4 py-3 text-sm font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        catMeta?.accentBorder,
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="truncate group-hover:text-primary transition-colors">
        {tool.shortName}
      </span>
    </Link>
  );
}