import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

import { toolCategories, type ToolDefinition } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export function ToolHeader({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  const catMeta = toolCategories[tool.category];

  return (
    <section className="relative overflow-hidden border-b bg-muted/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent),transparent)] opacity-40" />
      <Container className="relative pt-8 pb-7 sm:pt-10 sm:pb-9">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 opacity-60" />
          <Link href="/tools" className="hover:text-foreground transition-colors">
            Tools
          </Link>
          <ChevronRight className="size-3 opacity-60" />
          <span className="font-semibold text-foreground">{tool.name}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "hidden size-14 shrink-0 items-center justify-center rounded-2xl sm:inline-flex shadow-xs",
                catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {catMeta && (
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                      catMeta.badgeClass,
                    )}
                  >
                    {catMeta.label}
                  </span>
                )}
                {tool.badgeText && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    {tool.badgeText}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {tool.name}
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground max-w-xl">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border bg-card/80 backdrop-blur-xs px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-xs self-start sm:self-center">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Files processed 100% on your device</span>
          </div>
        </div>
      </Container>
    </section>
  );
}