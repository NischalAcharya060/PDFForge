import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { toolCategories, tools, type ToolCategory } from "@/config/tools";
import { itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { ToolCard } from "@/components/home/tool-card";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All PDF Tools — Merge, Split, Compress & Edit Online | PDFForge",
  description:
    "Browse every PDFForge tool — merge, split, compress, convert, rotate, watermark, protect, and organize PDF files in your browser. 100% free and private.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    type: "website",
    title: "All PDF Tools — Merge, Split, Compress & Edit Online | PDFForge",
    description:
      "Browse every PDFForge tool — merge, split, compress, convert, rotate, watermark, protect, and organize PDF files in your browser. 100% free and private.",
  },
};

const categories: { id: ToolCategory; label: string }[] = [
  { id: "organize", label: "Organize PDF" },
  { id: "compress", label: "Optimize & Compress PDF" },
  { id: "convert", label: "Convert to & from PDF" },
  { id: "edit", label: "Edit & Annotate PDF" },
  { id: "security", label: "PDF Security & Protection" },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={itemListSchema(tools.map((t) => ({ name: t.name, slug: t.slug })))} />

      {/* Hero Header */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_0%,var(--accent),transparent)] opacity-55"
        />
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-30 mask-fade-b"
        />
        <div
          aria-hidden="true"
          className="animate-aurora pointer-events-none absolute -left-40 top-10 size-[420px] -z-10 rounded-full bloom-primary-soft"
        />

        <Container className="relative py-16 text-center sm:py-24">
          <Reveal className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-sm">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Processed in your browser — zero files are uploaded
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Complete Suite of <span className="text-gradient">PDF Tools</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every tool you need to work with PDFs efficiently. Free, fast, private, and unlimited.
            </p>
          </Reveal>

          <RevealGroup
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            step={55}
            y={10}
          >
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="press rounded-full border border-border/80 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-md"
              >
                {cat.label}
              </a>
            ))}
          </RevealGroup>

          <RevealGroup
            className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
            step={80}
          >
            {[
              { value: tools.length, suffix: "", label: "Tools available" },
              { value: 0, suffix: "s", label: "Upload latency" },
              { value: 100, suffix: "%", label: "Client-side" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="surface lift rounded-2xl p-5 text-center transition-transform duration-500 ease-[var(--ease-premium)] hover:-translate-y-1"
              >
                <div className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.value === 0 ? 1 : 0}
                  />
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Categorized Tool Sections */}
      {categories.map((cat, catIndex) => {
        const categoryTools = tools.filter((tool) => tool.category === cat.id);
        if (categoryTools.length === 0) return null;
        const meta = toolCategories[cat.id];

        return (
          <section
            key={cat.id}
            id={cat.id}
            className={cn(
              "scroll-mt-20 border-b py-12 sm:py-16",
              catIndex % 2 === 1 && "bg-muted/20",
            )}
          >
            <Container>
              <Reveal className="mb-8 flex flex-col justify-between gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="animate-pulse-ring relative flex size-2.5 rounded-full bg-primary" />
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {meta?.label ?? cat.label}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{meta?.description}</p>
                </div>
                <span className="rounded-full border border-border/80 bg-card/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                  {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
                </span>
              </Reveal>

              <RevealGroup
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                step={60}
              >
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </RevealGroup>
            </Container>
          </section>
        );
      })}

      {/* Privacy Guarantee Footer Section */}
      <section className="relative isolate overflow-hidden py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-25 mask-radial-hero"
        />
        <Container>
          <Reveal className="mx-auto max-w-2xl space-y-4 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Your documents stay 100% yours
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every tool on this page executes in your browser sandbox using WebAssembly and
              client-side JavaScript. We never inspect, store, or transmit your documents.
            </p>
            <Button asChild className="press group/btn gap-2 rounded-xl px-6 font-bold shadow-premium">
              <Link href="/">
                Back to home
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}