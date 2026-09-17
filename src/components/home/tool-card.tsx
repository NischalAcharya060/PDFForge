import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import { cn } from "@/lib/utils";

export function ToolCard({
  tool,
  className,
}: {
  tool: ToolDefinition;
  className?: string;
}) {
  const Icon = tool.icon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="font-semibold leading-tight tracking-tight">
          {tool.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>
      <ArrowUpRight
        className="absolute right-4 top-4 size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
        aria-hidden="true"
      />
    </Link>
  );
}

export function ToolQuickLink({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-sm transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="size-4.5 text-primary" aria-hidden="true" />
      <span className="truncate">{tool.shortName}</span>
    </Link>
  );
}