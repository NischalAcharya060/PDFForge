import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { toolCategories, tools } from "@/config/tools";
import type { ToolCategory } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { ToolCard } from "@/components/home/tool-card";
import { SectionHeading } from "@/components/home/section-heading";

export const metadata: Metadata = {
  title: "All PDF Tools",
  description:
    "Browse every PDFForge tool — merge, split, compress, convert, rotate, protect, and organize PDF files in your browser.",
};

const categories: ToolCategory[] = [
  "organize",
  "convert",
  "compress",
  "edit",
  "security",
];

export default function ToolsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--accent),transparent)] opacity-60" />
        <Container className="relative pt-14 pb-10 text-center sm:pt-20">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Processed in your browser — files are never uploaded
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            PDF tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            All the tools you need to work with PDFs — no upload, no waiting,
            no sign-up.
          </p>
        </Container>
      </section>

      {categories.map((category) => {
        const categoryTools = tools.filter(
          (tool) => tool.category === category,
        );
        if (categoryTools.length === 0) return null;
        const meta = toolCategories[category];

        return (
          <section key={category} className="border-t">
            <Container className="py-12 sm:py-14">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {meta.label}
                </h2>
                <p className="mt-1 text-muted-foreground">{meta.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      <SectionHeading
        eyebrow="Privacy"
        title="Your documents stay yours"
        description="Every tool on this page runs locally in your browser. We never see, upload, or store your files."
        className="border-t"
      />
    </>
  );
}