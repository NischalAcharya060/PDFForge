import type { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";

import { toolCategories, tools, type ToolCategory } from "@/config/tools";
import { itemListSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { ToolCard } from "@/components/home/tool-card";

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
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--accent),transparent)] opacity-60" />
        <Container className="relative pt-16 pb-12 text-center sm:pt-20 sm:pb-16">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Processed in your browser — zero files are uploaded
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl text-foreground">
            Complete Suite of <span className="text-primary">PDF Tools</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every tool you need to work with PDFs efficiently. Free, fast, private, and unlimited.
          </p>

          {/* Quick jump navigation pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors shadow-xs"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Categorized Tool Sections */}
      {categories.map((cat) => {
        const categoryTools = tools.filter((tool) => tool.category === cat.id);
        if (categoryTools.length === 0) return null;
        const meta = toolCategories[cat.id];

        return (
          <section key={cat.id} id={cat.id} className="border-b scroll-mt-20 py-12 sm:py-16">
            <Container>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-primary" />
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {meta?.label ?? cat.label}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{meta?.description}</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      {/* Privacy Guarantee Footer Section */}
      <section className="bg-muted/30 py-16 text-center">
        <Container>
          <div className="mx-auto max-w-2xl space-y-3">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
              <Sparkles className="size-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Your documents stay 100% yours
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every tool on this page executes in your browser sandbox using WebAssembly and client-side JavaScript.
              We never inspect, store, or transmit your documents.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}