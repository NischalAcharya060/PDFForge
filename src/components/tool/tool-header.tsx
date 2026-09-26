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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_65%_at_50%_0%,var(--accent),transparent)] opacity-45"
      />
      <div
        aria-hidden="true"
        className="grid-pattern-sm pointer-events-none absolute inset-0 opacity-30 mask-fade-b"
      />

      <Container className="relative pb-8 pt-8 sm:pb-10 sm:pt-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="animate-fade-down mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          {[
            { href: "/", label: "Home" },
            { href: "/tools", label: "Tools" },
          ].map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <Link
                href={crumb.href}
                className="transition-colors duration-200 hover:text-primary"
              >
                {crumb.label}
              </Link>
              <ChevronRight className="size-3 opacity-60" />
            </span>
          ))}
          <span className="font-semibold text-foreground">{tool.name}</span>
        </nav>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "hidden size-14 shrink-0 items-center justify-center rounded-2xl shadow-xs sm:inline-flex",
                catMeta?.iconBgClass ?? "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
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
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                    {tool.badgeText}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {tool.name}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="glass inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-sm sm:self-center">
            <span className="relative flex size-4 items-center justify-center">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-500/60 pulse-ring" />
              <ShieldCheck className="relative size-4 text-emerald-600 dark:text-emerald-400" />
            </span>
            <span>Files processed 100% on your device</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
