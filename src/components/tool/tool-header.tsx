import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import { Container } from "@/components/layout/container";

export function ToolHeader({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;

  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent),transparent)] opacity-50" />
      <Container className="relative pt-10 pb-8 sm:pt-14 sm:pb-10">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          All tools
        </Link>
        <div className="flex items-start gap-4">
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:inline-flex">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {tool.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Files are processed in your browser — never uploaded
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}