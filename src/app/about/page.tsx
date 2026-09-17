import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Globe, Lock, ShieldCheck, Zap } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About PDFForge — Free, Fast & Private PDF Suite",
  description:
    "Learn about PDFForge's mission to provide a powerful, free, and completely private PDF toolbox running 100% in your browser.",
};

const pillars = [
  {
    icon: Lock,
    title: "100% Client-Side Privacy",
    description:
      "Unlike traditional PDF services that send your tax returns, medical records, and contracts to distant servers, PDFForge processes everything inside your browser tab.",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description:
      "No waiting in upload queues. By harnessing your computer's own processing power via WebAssembly, documents process in milliseconds.",
  },
  {
    icon: Globe,
    title: "Free & Accessible to All",
    description:
      "Because our infrastructure doesn't incur costly cloud compute charges, we can provide high-quality PDF tools to everyone worldwide without annoying paywalls.",
  },
  {
    icon: Cpu,
    title: "Modern Web Engineering",
    description:
      "Built with Next.js, TypeScript, pdf-lib, and PDF.js, PDFForge delivers desktop-grade PDF manipulation through the open web platform.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-4xl space-y-16">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
            <ShieldCheck className="size-4" />
            OUR MISSION
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            A Better, More Private Way to <span className="text-primary">Work with PDFs</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            PDFForge was created to solve a major problem on the internet: why should anyone have to
            upload confidential documents to untrusted cloud servers just to merge or compress a PDF?
          </p>
        </div>

        {/* Story Section */}
        <div className="rounded-3xl border bg-card p-8 sm:p-12 shadow-sm space-y-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            How PDFForge Works
          </h2>
          <p>
            When you visit PDFForge and drop a PDF into one of our tools, the file is loaded into
            your browser&apos;s memory using the standard HTML5 File API and WebAssembly. Libraries like
            <strong> pdf-lib</strong> and <strong>PDF.js</strong> compile, reorganize, and render the pages
            locally on your CPU.
          </p>
          <p>
            When you click &ldquo;Download,&rdquo; the newly forged document is generated directly
            from memory as an in-memory Blob and saved to your computer. At no point do your bytes ever
            leave your network card.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border bg-card p-6 shadow-xs space-y-3"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <pillar.icon className="size-5" />
              </span>
              <h3 className="font-bold text-base text-foreground">{pillar.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-card to-primary/5 p-8 text-center sm:p-12 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Experience the PDFForge difference</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Ready to merge, compress, or protect your documents with complete peace of mind?
          </p>
          <Button size="lg" asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
            <Link href="/tools">
              Explore all tools
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
