import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  FileCheck2,
  HardDrive,
  Laptop,
  Layers,
  Lock,
  MonitorDown,
  MousePointerClick,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";

import { popularTools, tools } from "@/config/tools";
import { siteConfig } from "@/config/site";
import { faqPageSchema, itemListSchema, webApplicationSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { ToolQuickLink } from "@/components/home/tool-card";
import { Button } from "@/components/ui/button";
import { HomeToolBrowser } from "@/components/home/home-tool-browser";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, RevealGroup, RevealWords } from "@/components/motion/reveal";
import { AnimatedUnderline } from "@/components/motion/animated-underline";
import { Marquee } from "@/components/motion/marquee";
import { Spotlight } from "@/components/motion/spotlight";

export const metadata: Metadata = {
  title: "Free Online PDF Tools — Merge, Split, Compress & Convert | PDFForge",
  description:
    "18 free PDF tools that run 100% in your browser. Merge, split, compress, convert, rotate, watermark, sign and protect PDF files — no uploads, no account, no watermarks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: "Free Online PDF Tools — Merge, Split, Compress & Convert | PDFForge",
    description:
      "18 free PDF tools that run 100% in your browser. No uploads, no account, no watermarks.",
  },
};

const comparisonPoints = [
  {
    feature: "File Privacy & Security",
    forge: "Processed in local browser RAM, never uploaded to any server",
    cloud: "Sent over the network and stored on third-party cloud servers",
  },
  {
    feature: "Execution Speed",
    forge: "Instant WebAssembly compilation (zero upload/download latency)",
    cloud: "Slow queue delays, server cold starts & upload lag",
  },
  {
    feature: "Account & Friction",
    forge: "100% anonymous & unrestricted — zero sign-up required",
    cloud: "Requires email sign-ups, cookies & credit cards",
  },
  {
    feature: "File Size & Batch Caps",
    forge: "No artificial limitations — bounded only by your device memory",
    cloud: "Strict file limits (usually 5–10 MB max on free tier)",
  },
  {
    feature: "Document Watermarking",
    forge: "Clean, professional output — zero promotional stamps",
    cloud: "Often brands promotional watermarks unless paid",
  },
];

const steps = [
  {
    step: "01",
    title: "Select your files",
    description:
      "Drag and drop PDFs or images directly into the browser. Files are read straight into memory without uploading.",
  },
  {
    step: "02",
    title: "Configure & manipulate",
    description:
      "Reorder pages visually, tune compression rates, stamp custom watermarks, or apply military-grade encryption.",
  },
  {
    step: "03",
    title: "Instant local download",
    description:
      "Your new document is compiled in milliseconds and saved directly to your downloads folder.",
  },
];

const faqs = [
  {
    question: "How does PDFForge process files without uploading them?",
    answer:
      "PDFForge leverages modern browser capabilities — WebAssembly, ArrayBuffers, and optimized client JavaScript PDF engines — to read and manipulate documents directly in your computer's RAM. Your confidential files never touch any external server or cloud storage.",
  },
  {
    question: "Is PDFForge truly free?",
    answer:
      "Yes, completely. Because processing happens on your own device rather than on expensive cloud servers, all 18 tools are 100% free with no hidden paywalls, no credits, and no promotional watermarks.",
  },
  {
    question: "What is the maximum file size I can process?",
    answer:
      "Since execution is client-side, the only limit is your device's available RAM and browser tab capacity. You can comfortably process multi-hundred page documents and large multi-megabyte PDFs without artificial restrictions.",
  },
  {
    question: "Which PDF tools are available on PDFForge?",
    answer:
      "PDFForge offers 18 free tools: Merge, Split, Compress, Rotate, JPG to PDF, PDF to JPG, Delete Pages, Extract Pages, Reorder Pages, Protect with Password, Unlock PDF, Page Numbers, Watermark, Sign PDF, WebP to PDF, PNG to PDF, PDF to PNG, and PDF to Text.",
  },
  {
    question: "Can I use PDFForge on my phone or tablet?",
    answer:
      "Yes. PDFForge works in any modern mobile browser — iOS Safari and Android Chrome included — with full touch support and responsive controls. No app store installation required.",
  },
  {
    question: "Do I need to install any software to use PDFForge?",
    answer:
      "No. PDFForge runs entirely in your web browser. There is nothing to download or install, and no account or sign-up is required to access the full suite of PDF tools.",
  },
  {
    question: "Is my data safe with PDFForge?",
    answer:
      "Absolutely. Your files are never transmitted across the network. All operations run strictly inside your local browser memory sandbox. Nothing is stored on a server, and we have zero access to your documents.",
  },
  {
    question: "How many files can I process at once?",
    answer:
      "There is no limit on the number of files you can process. The only constraint is your device's available memory, so feel free to process documents in bulk without restrictions.",
  },
];

const trustStrip = [
  "No uploads",
  "No sign-up",
  "No watermarks",
  "Unlimited files",
  "Works offline",
  "AES-256 encryption",
  "Cross-platform",
  "Free forever",
];

export default function HomePage() {
  const homepageSchemas = [
    faqPageSchema(faqs),
    itemListSchema(tools.map((t) => ({ name: t.name, slug: t.slug }))),
    webApplicationSchema(
      { name: `${siteConfig.name} PDF Tools`, slug: "", seoDescription: siteConfig.description },
      {
        url: `${siteConfig.url}/tools`,
        featureList: [
          "Merge and split PDFs",
          "Compress PDF file size",
          "Convert images to and from PDF",
          "Add page numbers and watermarks",
          "Password-protect and unlock PDFs",
          "Sign documents electronically",
          "100% private — no files uploaded",
        ],
      },
    ),
  ];

  return (
    <>
      {homepageSchemas.map((schema, i) => (
        <JsonLd key={`${schema["@type"]}-${i}`} data={schema} />
      ))}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-card/40 to-background pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Background Mesh & Dot Pattern */}
        <div
          aria-hidden="true"
          className="grid-pattern mask-radial-hero pointer-events-none absolute inset-0 opacity-50"
        />

        {/* Drifting ambient orbs */}
        <div
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -top-40 left-1/2 size-[720px] -translate-x-1/2 rounded-full bloom-primary opacity-70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute -bottom-32 -left-24 size-[420px] rounded-full bloom-primary-soft opacity-80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute -right-24 top-40 hidden size-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.14),transparent)] blur-3xl lg:block"
        />

        <Container className="relative text-center">
          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <RevealWords text="Every tool you need to work with PDFs," delay={60} />
            <br className="hidden sm:block" />{" "}
            <AnimatedUnderline delay={470} duration={700} className="whitespace-nowrap">
              <span className="text-primary">
                <RevealWords text="all in one place" delay={280} />
              </span>
            </AnimatedUnderline>
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up text-balance text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
            style={{ animationDelay: "520ms" }}
          >
            Merge, split, compress, convert, watermark, and protect your PDF documents.
            100% free, unlimited, and processed locally on your device with instant speed.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3.5 sm:mt-10 sm:flex-row"
            style={{ animationDelay: "620ms" }}
          >
            <Button
              size="xl"
              asChild
              className="shine-loop group h-13 w-full gap-2 rounded-2xl text-base font-bold shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-8"
            >
              <Link href="/tools/merge-pdf">
                Merge PDFs now
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              asChild
              className="h-13 w-full rounded-2xl border-border/80 bg-card/70 text-base font-semibold shadow-sm backdrop-blur-sm hover:scale-[1.02] hover:bg-card/90 active:scale-[0.98] sm:w-auto sm:px-8"
            >
              <Link href="#tools">Explore all {tools.length} tools</Link>
            </Button>
          </div>

          {/* Quick Launch Dock */}
          <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
            <RevealGroup
              className="glass-strong rounded-3xl border border-border/70 p-3 shadow-lg sm:p-4"
              step={80}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Popular Quick Tools
                </span>
                <Link
                  href="#tools"
                  className="group/see flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  View all {tools.length}
                  <span className="inline-block transition-transform duration-300 group-hover/see:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                {popularTools.slice(0, 4).map((tool) => (
                  <ToolQuickLink key={tool.slug} tool={tool} />
                ))}
              </div>
            </RevealGroup>
          </div>
        </Container>

        {/* Trust Strip */}
        <div className="relative mt-14 sm:mt-16">
          <Marquee className="py-1" speed={38}>
            {trustStrip.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2.5 px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80"
              >
                <span className="size-1.5 rounded-full bg-primary/60" />
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Interactive Tool Browser (Search & Categories & Cards Grid) */}
      <HomeToolBrowser />

      {/* Desktop App Download Section */}
      <section className="relative overflow-hidden border-t bg-gradient-to-b from-background via-card/40 to-background py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute -top-24 right-1/4 size-[480px] rounded-full bloom-primary-soft"
        />

        <Container className="relative">
          <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <MonitorDown className="size-3.5" />
              <span>WINDOWS DESKTOP APP</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Take PDFForge offline with the desktop app
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              A fast, private PDF viewer that works offline. Open, zoom, navigate, print, and
              organize PDFs right from your files — no internet, no uploads, ever.
            </p>
          </Reveal>

          <Reveal delay={120} y={40}>
            <Spotlight className="lift mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/90 bg-card shadow-xl">
              <div className="grid lg:grid-cols-2">
                <div className="border-b border-border/80 p-6 sm:p-9 lg:border-b-0 lg:border-r">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                      <Laptop className="size-6" />
                    </span>
                    <div>
                      <div className="text-lg font-bold tracking-tight text-foreground">
                        {siteConfig.desktop.name}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground">
                        Version {siteConfig.desktop.version} • Windows 10/11
                      </div>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm">
                    {[
                      { icon: WifiOff, label: "100% offline — no cloud, no account" },
                      { icon: ShieldCheck, label: "Local rendering with pdf.js" },
                      { icon: Zap, label: "Zoom, thumbnails, print & shortcuts" },
                      { icon: FileCheck2, label: "Opens via double-click on any .pdf" },
                    ].map((point) => (
                      <li
                        key={point.label}
                        className="group/point flex items-start gap-2.5 text-foreground/90"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 transition-transform duration-300 ease-[var(--ease-spring)] group-hover/point:scale-110">
                          <point.icon className="size-3 text-primary" />
                        </span>
                        <span className="font-medium transition-colors duration-300 group-hover/point:text-foreground">
                          {point.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/6 to-transparent p-6 text-center sm:p-9">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Free download for Windows
                  </span>
                  <Button
                    size="xl"
                    asChild
                    className="shine-loop group w-full gap-2 rounded-2xl text-base font-bold shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                  >
                    <Link href="/download">
                      <Download className="size-5" />
                      Get the desktop app
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Windows 10/11 • Free &amp; offline •{" "}
                    <Link
                      href="/download"
                      className="text-primary underline-offset-4 transition-opacity hover:opacity-75 hover:underline"
                    >
                      View download page
                    </Link>
                  </p>
                </div>
              </div>
            </Spotlight>
          </Reveal>
        </Container>
      </section>

      {/* Product Demo Showcase (Mac Window Mockup) */}
      <section className="relative overflow-hidden border-t bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <Play className="size-3.5" />
              <span>LIGHTNING SPEED IN ACTION</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              The entire studio, in 20 seconds
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Watch how PDFForge merges, converts, and protects your documents in real-time —
              completely inside your browser memory, with zero waiting for server queues.
            </p>
          </Reveal>

          {/* Mac-Style Window Frame */}
          <Reveal delay={120} y={44} scale={0.98}>
            <div className="relative mx-auto max-w-4xl">
              {/* Ambient backlight that breathes gently. */}
              <div
                aria-hidden="true"
                className="animate-pulse pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gradient-to-r from-primary/25 via-amber-500/15 to-primary/25 opacity-50 blur-2xl"
              />

              <div className="relative overflow-hidden rounded-3xl border border-border/90 bg-card shadow-2xl shadow-black/10">
                {/* Window Title Bar */}
                <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500/80 shadow-xs" />
                    <span className="size-3 rounded-full bg-amber-500/80 shadow-xs" />
                    <span className="size-3 rounded-full bg-emerald-500/80 shadow-xs" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/80 px-3 py-1 font-mono text-[11px] font-medium text-muted-foreground shadow-2xs">
                    <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>https://pdfforge.app/tools/merge-pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full rounded-full bg-emerald-500/70 pulse-ring" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Local RAM
                  </div>
                </div>

                {/* Video Player */}
                <div className="bg-black/95 p-1 sm:p-2">
                  <video
                    className="aspect-video w-full rounded-2xl bg-black"
                    src="/brag.mp4"
                    poster="/brag-poster.jpg"
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="PDFForge product demo video"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Bento Grid: Engineered for Speed, Privacy & Simplicity */}
      <section className="border-t py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-12 max-w-3xl space-y-4 text-center sm:mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              <span>ENGINEERED DIFFERENTLY</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Built for privacy, engineered for speed
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Why settle for clunky cloud upload tools that log your files when you can run
              state-of-the-art WebAssembly locally?
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Bento Card 1 (Large 2-column span on lg): 100% Private Sandbox */}
            <Reveal className="relative lg:col-span-2" delay={0}>
              <Spotlight className="lift border-gradient-hover group h-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 shadow-xs hover:border-primary/40">
                <div className="p-6 sm:p-8">
                  <span className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Lock className="size-6" />
                  </span>

                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    100% Private In-Browser Sandbox
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Every operation executes in your browser&apos;s isolated RAM memory. Your
                    confidential legal contracts, financial spreadsheets, and personal IDs never
                    traverse the public internet.
                  </p>

                  {/* Visual Memory Flow Diagram */}
                  <div className="mt-6 rounded-2xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm sm:p-5">
                    <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Architecture Flow
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
                      {[
                        {
                          icon: HardDrive,
                          title: "Your Device",
                          sub: "Local PDF File",
                          box: "rounded-xl border border-border/60 bg-muted/30 p-3",
                          tone: "text-foreground",
                          iconTone: "text-primary",
                        },
                        {
                          icon: Cpu,
                          title: "Browser RAM (Local)",
                          sub: "Memory Sandbox",
                          box: "rounded-xl border border-primary/30 bg-primary/5 p-3",
                          tone: "text-primary",
                          iconTone: "text-primary",
                        },
                        {
                          icon: FileCheck2,
                          title: "Instant Output",
                          sub: "Direct Download",
                          box: "rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3",
                          tone: "text-emerald-600 dark:text-emerald-400",
                          iconTone: "text-emerald-600 dark:text-emerald-400",
                        },
                      ].map((node, index) => (
                        <div
                          key={node.title}
                          className={`${node.box} animate-fade-up transition-transform duration-500 ease-[var(--ease-spring)] hover:-translate-y-1`}
                          style={{ animationDelay: `${index * 120}ms` }}
                        >
                          <div
                            className={`flex items-center justify-center gap-1.5 text-xs font-bold ${node.tone}`}
                          >
                            <node.icon className={`size-3.5 ${node.iconTone}`} />
                            {node.title}
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {node.sub}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-rose-500/90 dark:text-rose-400">
                      <XCircle className="size-3.5" />
                      Remote Cloud Servers: Zero Requests • Zero Storage • Zero Logging
                    </div>
                  </div>
                </div>
              </Spotlight>
            </Reveal>

            {/* Bento Card 2: Zero Queue & Blazing Speed */}
            <Reveal className="relative" delay={100}>
              <Spotlight className="lift border-gradient-hover group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/40 sm:p-8">
                <div>
                  <span className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-xs transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white dark:text-amber-400">
                    <Zap className="size-6" />
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Zero Queue &amp; Blazing Speed
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    No server warm-ups, no upload lag. Operations complete at raw CPU clock speed.
                  </p>
                </div>

                {/* Speed Benchmark Comparison */}
                <div className="mt-6 space-y-4 rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1 text-primary">
                        <Zap className="size-3" /> PDFForge Local
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        0.2s
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="bar-fill h-full w-full rounded-full bg-gradient-to-r from-primary/70 to-primary" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>Cloud Converters</span>
                      <span className="font-mono">8.4s</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="bar-fill h-full w-[25%] rounded-full bg-muted-foreground/40"
                        style={{ animationDelay: "180ms" }}
                      />
                    </div>
                  </div>
                </div>
              </Spotlight>
            </Reveal>

            {/* Bento Card 3: No Accounts or Friction */}
            <Reveal className="relative" delay={180}>
              <Spotlight className="lift border-gradient-hover group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/40 sm:p-8">
                <div>
                  <span className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-xs transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white dark:text-emerald-400">
                    <MousePointerClick className="size-6" />
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Zero Sign-Up or Barriers
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Jump right into productivity with zero friction. No accounts, no
                    subscriptions, and no paywalls.
                  </p>
                </div>

                <div className="mt-6 space-y-2.5 text-xs font-semibold text-foreground">
                  {[
                    "No credit card or monthly plan",
                    "No email capture or marketing spam",
                    "No promotional watermark stamps",
                  ].map((line) => (
                    <div
                      key={line}
                      className="group/check flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-spring)] group-hover/check:scale-125" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </Spotlight>
            </Reveal>

            {/* Bento Card 4 (Large 2-column span on lg): Wasm & Modern PDF Engine */}
            <Reveal className="relative lg:col-span-2" delay={240}>
              <Spotlight className="lift border-gradient-hover group h-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-6 shadow-xs hover:border-primary/40 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 shadow-xs transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white dark:text-violet-400">
                    <Cpu className="size-6" />
                  </span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Laptop className="size-4 text-foreground" />
                    <span>Desktop</span>
                    <span>•</span>
                    <Smartphone className="size-4 text-foreground" />
                    <span>Mobile &amp; Tablet</span>
                  </div>
                </div>

                <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  State-of-the-Art WebAssembly Engine
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Built on modern PDF specifications and native WebAssembly binaries. Ensures
                  lossless visual fidelity, preserves embedded vector graphics, hyperlinks, and
                  document metadata without quality degradation.
                </p>

                <RevealGroup
                  className="mt-6 flex flex-wrap gap-2"
                  step={70}
                  y={12}
                >
                  {[
                    "High-Speed Local Engine",
                    "AES-256 Encryption",
                    "Lossless Vector Rendering",
                    "Cross-Platform Responsive",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="press cursor-default rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    >
                      {chip}
                    </span>
                  ))}
                </RevealGroup>
              </Spotlight>
            </Reveal>
          </div>

          {/* Headline stat strip */}
          <RevealGroup
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
            step={90}
          >
            {[
              { value: tools.length, suffix: "", label: "PDF tools, all client-side" },
              { value: 0, suffix: "s", label: "Upload or download latency" },
              { value: 100, suffix: "%", label: "Processed on your device" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="surface group/stat relative overflow-hidden rounded-2xl p-5 text-center transition-transform duration-500 ease-[var(--ease-premium)] hover:-translate-y-1"
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

      {/* High-Contrast Comparison Matrix: PDFForge vs Cloud Converters */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-12 max-w-3xl space-y-4 text-center sm:mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>THE PRIVACY ADVANTAGE</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why PDFForge is built different
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Traditional PDF converters upload your personal tax returns, medical files, and
              legal documents to undisclosed remote servers. Here is how PDFForge protects you:
            </p>
          </Reveal>

          <Reveal delay={120} y={40}>
            <div className="surface mx-auto max-w-4xl overflow-hidden rounded-3xl">
              {/* Header row */}
              <div className="grid grid-cols-12 border-b border-border/80 bg-muted/40 p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:p-5">
                <div className="col-span-5 sm:col-span-4">Feature</div>
                <div className="col-span-7 flex items-center gap-1.5 font-black text-primary sm:col-span-4">
                  <span className="size-2 rounded-full bg-primary" />
                  PDFForge (In-Browser)
                </div>
                <div className="hidden sm:col-span-4 sm:block">Other PDF Sites</div>
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-border/60 text-xs sm:text-sm">
                {comparisonPoints.map((pt) => (
                  <div
                    key={pt.feature}
                    className="group/row grid grid-cols-12 items-center gap-2 p-4 transition-colors duration-300 hover:bg-muted/20 sm:gap-4 sm:p-5"
                  >
                    <div className="col-span-12 font-bold text-foreground sm:col-span-4">
                      {pt.feature}
                    </div>
                    <div className="col-span-12 flex items-start gap-2 rounded-xl bg-emerald-500/5 p-2.5 font-medium text-emerald-600 transition-transform duration-500 ease-[var(--ease-premium)] group-hover/row:translate-x-1 sm:col-span-4 sm:bg-transparent sm:p-0 dark:text-emerald-400">
                      <Check className="mt-0.5 size-4 shrink-0" />
                      <span>{pt.forge}</span>
                    </div>
                    <div className="col-span-12 pl-6 text-xs leading-relaxed text-muted-foreground sm:col-span-4 sm:pl-0">
                      <span className="mb-0.5 block font-semibold text-foreground/70 sm:hidden">
                        Other PDF Sites:
                      </span>
                      {pt.cloud}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How it Works Workflow */}
      <section className="border-t py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="space-y-6 lg:col-span-6" x={-32} y={0}>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
                <Layers className="size-3.5" />
                <span>SIMPLE WORKFLOW</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Three easy steps, zero setup required
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Work at full speed without installing desktop software, configuring drivers, or
                registering user accounts.
              </p>

              <div className="space-y-6 pt-2">
                {steps.map((st, index) => (
                  <div key={st.step} className="group/step flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-black text-sm text-primary-foreground shadow-premium transition-all duration-500 ease-[var(--ease-spring)] group-hover/step:scale-110 group-hover/step:-rotate-3">
                      {st.step}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground transition-colors duration-300 group-hover/step:text-primary">
                        <span className="animate-fade-up inline-block" style={{ animationDelay: `${index * 90}ms` }}>
                          {st.title}
                        </span>
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="lg:col-span-6" x={32} y={0} delay={120}>
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-8 shadow-xl backdrop-blur-sm sm:p-10">
                {/* Decorative background circle */}
                <div
                  aria-hidden="true"
                  className="animate-float-slow pointer-events-none absolute -bottom-12 -right-12 size-60 rounded-full bloom-primary-soft"
                />

                <div className="relative">
                  <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                    <FileCheck2 className="size-7" aria-hidden="true" />
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
                    Your documents stay strictly yours
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    When you process a document with PDFForge, your device compiles the PDF
                    locally. There are no network uploads, no server queues, and zero cached
                    backups left behind on remote machines.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      className="group/btn gap-1.5 rounded-xl font-bold shadow-premium"
                    >
                      <Link href="/tools">
                        Start using tools
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="rounded-xl font-semibold">
                      <Link href="/privacy">Read privacy policy</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-12 max-w-3xl space-y-4 text-center sm:mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Everything you need to know about PDFForge and client-side PDF manipulation.
            </p>
          </Reveal>

          <RevealGroup className="mx-auto max-w-3xl space-y-3.5" step={60}>
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group/faq lift border-gradient-hover overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xs backdrop-blur-sm open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold text-foreground transition-colors duration-300 hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-400 ease-[var(--ease-spring)] group-open/faq:rotate-180 group-open/faq:border-primary/40 group-open/faq:bg-primary/10 group-open/faq:text-primary group-hover/faq:border-primary/40 group-hover/faq:text-primary">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="shrink-0"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border/60 px-5 pb-5 pt-3.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {faq.answer}
                </div>
              </details>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative overflow-hidden border-t bg-gradient-to-b from-card via-background to-card py-20 sm:py-28">
        {/* Background Ambient Mesh */}
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 opacity-40 mask-fade-b"
        />
        <div
          aria-hidden="true"
          className="animate-aurora pointer-events-none absolute -bottom-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bloom-primary"
        />

        <Container className="relative text-center">
          <Reveal className="mx-auto max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              <span>READY TO BEGIN?</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
              Ready to forge your PDFs?
            </h2>

            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Choose from {tools.length} powerful in-browser tools. No registration, no
              watermarks, completely free forever.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
              <Button
                size="xl"
                asChild
                className="shine-loop group w-full gap-2 rounded-2xl text-base font-bold shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-8"
              >
                <Link href="/tools">
                  Explore all {tools.length} tools
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>

              <Button
                size="xl"
                variant="outline"
                asChild
                className="h-14 w-full rounded-2xl border-border/80 bg-card/60 text-base font-semibold shadow-sm backdrop-blur-sm hover:scale-[1.02] hover:bg-card/90 active:scale-[0.98] sm:w-auto sm:px-8"
              >
                <Link href="/tools/merge-pdf">Merge PDFs now</Link>
              </Button>
            </div>

            {/* Micro Trust Seals */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-6 text-xs font-semibold text-muted-foreground">
              {[
                { icon: ShieldCheck, tone: "text-emerald-600 dark:text-emerald-400", label: "Zero Files Uploaded" },
                { icon: Zap, tone: "text-primary", label: "Instant Local Engine" },
                { icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400", label: "100% Free Forever" },
              ].map((seal) => (
                <span key={seal.label} className="flex items-center gap-1.5">
                  <seal.icon className={`size-4 ${seal.tone}`} />
                  {seal.label}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}