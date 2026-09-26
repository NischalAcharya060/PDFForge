import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Globe, Lock, ShieldCheck, Zap } from "lucide-react";

import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";

export const metadata: Metadata = {
  title: "About PDFForge — Free, Fast & Private PDF Suite",
  description:
    "Learn about PDFForge's mission to provide a powerful, free, and completely private PDF toolbox running 100% in your browser.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    title: "About PDFForge — Free, Fast & Private PDF Suite",
    description:
      "Learn about PDFForge's mission to provide a powerful, free, and completely private PDF toolbox running 100% in your browser.",
  },
};

const aboutSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PDFForge",
    url: `${siteConfig.url}/about`,
    description:
      "PDFForge is a free, privacy-focused PDF toolbox that runs entirely in your browser. No uploads, no accounts, no watermarks.",
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.supportEmail,
      logo: `${siteConfig.url}/logo.png`,
    },
  },
];

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
    <div className="relative isolate overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-25 mask-fade-b"
      />
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 -z-10 rounded-full bloom-primary-soft"
      />

      {aboutSchemas.map((schema) => (
        <JsonLd key={schema["@type"] as string} data={schema} />
      ))}
      <Container className="max-w-4xl space-y-16">
        {/* Header */}
        <Reveal className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-bold text-primary">
            <ShieldCheck className="size-4" />
            OUR MISSION
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            A Better, More Private Way to <span className="text-gradient">Work with PDFs</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            PDFForge was created to solve a major problem on the internet: why should anyone have to
            upload confidential documents to untrusted cloud servers just to merge or compress a PDF?
          </p>
        </Reveal>

        {/* Story section */}
        <Reveal delay={100} y={30}>
          <div className="surface space-y-6 rounded-3xl border p-8 text-sm leading-relaxed text-muted-foreground shadow-premium sm:p-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              How PDFForge Works
            </h2>
            <p>
              When you visit PDFForge and drop a PDF into one of our tools, the file is loaded into
              your browser&apos;s memory using the standard HTML5 File API and WebAssembly. Libraries
              like <strong className="text-foreground">pdf-lib</strong> and{" "}
              <strong className="text-foreground">PDF.js</strong> compile, reorganize, and render
              the pages locally on your CPU.
            </p>
            <p>
              When you click &ldquo;Download,&rdquo; the newly forged document is generated directly
              from memory as an in-memory Blob and saved to your computer. At no point do your bytes
              ever leave your network card.
            </p>
          </div>
        </Reveal>

        {/* Pillars */}
        <RevealGroup className="grid gap-6 sm:grid-cols-2" step={80} y={26}>
          {pillars.map((pillar) => (
            <Spotlight
              key={pillar.title}
              className="lift border-gradient-hover group space-y-3 rounded-3xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-400 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <pillar.icon className="size-5" />
              </span>
              <h3 className="text-base font-bold text-foreground">{pillar.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </Spotlight>
          ))}
        </RevealGroup>

        {/* CTA */}
        <Reveal delay={120} y={30}>
          <div className="surface relative isolate overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/10 via-card to-primary/5 p-8 text-center shadow-premium sm:p-12">
            <div
              aria-hidden="true"
              className="animate-float-slow pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bloom-primary-soft"
            />
            <div className="relative space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Experience the PDFForge difference
              </h2>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                Ready to merge, compress, or protect your documents with complete peace of mind?
              </p>
              <Button
                size="xl"
                asChild
                className="press group/btn gap-2 rounded-2xl px-8 font-bold shadow-premium-lg"
              >
                <Link href="/tools">
                  Explore all tools
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
