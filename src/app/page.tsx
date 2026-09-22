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
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-card/40 to-background pt-12 sm:pt-20 pb-16 sm:pb-24">
        {/* Background Mesh & Dot Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)]" />
        
        {/* Ambient Top Glow Bloom */}
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 size-[680px] rounded-full bg-gradient-to-b from-primary/20 via-amber-500/10 to-transparent blur-3xl opacity-80" />

        <Container className="relative text-center">
          {/* Privacy Trust Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-card/85 px-4 py-1.5 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md transition-all hover:border-primary/40">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">
              Files never leave your computer • <strong className="text-foreground font-semibold">100% Private In-Browser</strong>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl text-foreground">
            Every tool you need to work with PDFs,{" "}
            <span className="relative inline-block whitespace-nowrap text-primary">
              <span className="relative z-10">all in one place</span>
              <svg
                className="absolute -bottom-2.5 left-0 -z-0 h-3.5 w-full text-primary/30"
                viewBox="0 0 358 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9C118.5 2.5 239.5 2.5 355 9"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Merge, split, compress, convert, watermark, and protect your PDF documents.
            100% free, unlimited, and processed locally on your device with instant speed.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-13 sm:h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 rounded-2xl gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Link href="/tools/merge-pdf">
                Merge PDFs now
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-13 sm:h-14 px-8 text-base font-semibold rounded-2xl border-border/80 bg-card/70 backdrop-blur-xs hover:bg-muted/80 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Link href="#tools">Explore all {tools.length} tools</Link>
            </Button>
          </div>

          {/* Quick Launch Dock */}
          <div className="mx-auto mt-8 sm:mt-10 max-w-4xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Popular Quick Tools
              </span>
              <Link
                href="#tools"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all {tools.length} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {popularTools.slice(0, 4).map((tool) => (
                <ToolQuickLink key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Tool Browser (Search & Categories & Cards Grid) */}
      <HomeToolBrowser />

      {/* Desktop App Download Section */}
      <section className="relative border-t bg-gradient-to-b from-background via-card/40 to-background py-16 sm:py-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-1/4 size-[480px] rounded-full bg-primary/10 blur-3xl" />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <MonitorDown className="size-3.5" />
              <span>WINDOWS DESKTOP APP</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Take PDFForge offline with the desktop app
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              A fast, private PDF viewer that works offline. Open, zoom, navigate, print, and
              organize PDFs right from your files — no internet, no uploads, ever.
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/90 bg-card shadow-xl">
            <div className="grid lg:grid-cols-2">
              <div className="border-b lg:border-b-0 lg:border-r border-border/80 p-6 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                    <Laptop className="size-6" />
                  </span>
                  <div>
                    <div className="text-lg font-bold text-foreground tracking-tight">
                      {siteConfig.desktop.name}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Version {siteConfig.desktop.version} • Windows 10/11
                    </div>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {[
                    { icon: WifiOff, label: "100% offline — no cloud, no account" },
                    { icon: ShieldCheck, label: "Local rendering with pdf.js" },
                    { icon: Zap, label: "Zoom, thumbnails, print & shortcuts" },
                    { icon: FileCheck2, label: "Opens via double-click on any .pdf" },
                  ].map((point) => (
                    <li key={point.label} className="flex items-start gap-2.5 text-foreground/90">
                      <point.icon className="size-4 shrink-0 mt-0.5 text-primary" />
                      <span className="font-medium">{point.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 p-6 sm:p-9 text-center bg-gradient-to-br from-primary/5 to-transparent">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Free download for Windows
                </span>
                <Button
                  size="lg"
                  asChild
                  className="h-14 px-9 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all gap-2"
                >
                  <Link href="/download">
                    <Download className="size-5" />
                    Get the desktop app
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Windows 10/11 • Free & offline •{" "}
                  <Link href="/download" className="text-primary underline-offset-4 hover:underline">
                    View download page
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Product Demo Showcase (Mac Window Mockup) */}
      <section className="relative border-t py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Play className="size-3.5" />
              <span>LIGHTNING SPEED IN ACTION</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              The entire studio, in 20 seconds
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              Watch how PDFForge merges, converts, and protects your documents in real-time —
              completely inside your browser memory, with zero waiting for server queues.
            </p>
          </div>

          {/* Mac-Style Window Frame */}
          <div className="relative mx-auto max-w-4xl">
            {/* Ambient Backlight Glow */}
            <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/20 via-amber-500/15 to-primary/20 opacity-50 blur-2xl" />

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
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Local RAM
                </div>
              </div>

              {/* Video Player */}
              <div className="bg-black/95 p-1 sm:p-2">
                <video
                  className="w-full aspect-video rounded-2xl bg-black"
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
        </Container>
      </section>

      {/* Bento Grid: Engineered for Speed, Privacy & Simplicity */}
      <section className="border-t py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              <span>ENGINEERED DIFFERENTLY</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Built for privacy, engineered for speed
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              Why settle for clunky cloud upload tools that log your files when you can run state-of-the-art WebAssembly locally?
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Bento Card 1 (Large 2-column span on lg): 100% Private Sandbox */}
            <div className="group lg:col-span-2 relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-xs">
                  <Lock className="size-6" />
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                100% Private In-Browser Sandbox
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                Every operation executes in your browser&apos;s isolated RAM memory. Your confidential legal contracts, financial spreadsheets, and personal IDs never traverse the public internet.
              </p>

              {/* Visual Memory Flow Diagram */}
              <div className="mt-6 rounded-2xl border border-border/70 bg-background/80 p-4 sm:p-5 backdrop-blur-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Architecture Flow
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                      <HardDrive className="size-3.5 text-primary" />
                      Your Device
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Local PDF File</div>
                  </div>

                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 relative">
                    <div className="text-xs font-bold text-primary flex items-center justify-center gap-1.5">
                      <Cpu className="size-3.5" />
                      Browser RAM (Local)
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Memory Sandbox</div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                      <FileCheck2 className="size-3.5" />
                      Instant Output
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Direct Download</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-rose-500/90 dark:text-rose-400">
                  <XCircle className="size-3.5" />
                  Remote Cloud Servers: Zero Requests • Zero Storage • Zero Logging
                </div>
              </div>
            </div>

            {/* Bento Card 2: Zero Queue & Blazing Speed */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-xs mb-6">
                  <Zap className="size-6" />
                </span>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Zero Queue & Blazing Speed
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  No server warm-ups, no upload lag. Operations complete at raw CPU clock speed.
                </p>
              </div>

              {/* Speed Benchmark Comparison */}
              <div className="mt-6 space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-primary flex items-center gap-1">
                      <Zap className="size-3" /> PDFForge Local
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">0.2s</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-full rounded-full bg-primary" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Cloud Converters</span>
                    <span className="font-mono">8.4s</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[25%] rounded-full bg-muted-foreground/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: No Accounts or Friction */}
            <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-xs mb-6">
                  <MousePointerClick className="size-6" />
                </span>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Zero Sign-Up or Barriers
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Jump right into productivity with zero friction. No accounts, no subscriptions, and no paywalls.
                </p>
              </div>

              <div className="mt-6 space-y-2 text-xs font-semibold text-foreground">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>No credit card or monthly plan</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>No email capture or marketing spam</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>No promotional watermark stamps</span>
                </div>
              </div>
            </div>

            {/* Bento Card 4 (Large 2-column span on lg): Wasm & Modern PDF Engine */}
            <div className="group lg:col-span-2 relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors shadow-xs">
                  <Cpu className="size-6" />
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Laptop className="size-4 text-foreground" />
                  <span>Desktop</span>
                  <span>•</span>
                  <Smartphone className="size-4 text-foreground" />
                  <span>Mobile & Tablet</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                State-of-the-Art WebAssembly Engine
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                Built on modern PDF specifications and native WebAssembly binaries. Ensures lossless visual fidelity, preserves embedded vector graphics, hyperlinks, and document metadata without quality degradation.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 shadow-2xs">
                  ⚡ High-Speed Local Engine
                </span>
                <span className="rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 shadow-2xs">
                  🔒 AES-256 Encryption
                </span>
                <span className="rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 shadow-2xs">
                  🎨 Lossless Vector Rendering
                </span>
                <span className="rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 shadow-2xs">
                  📱 Cross-Platform Responsive
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* High-Contrast Comparison Matrix: PDFForge vs Cloud Converters */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>THE PRIVACY ADVANTAGE</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Why PDFForge is built different
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              Traditional PDF converters upload your personal tax returns, medical files, and legal documents to undisclosed remote servers. Here is how PDFForge protects you:
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/90 bg-card shadow-lg">
            {/* Header row */}
            <div className="grid grid-cols-12 border-b border-border/80 bg-muted/40 p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-5 sm:col-span-4">Feature</div>
              <div className="col-span-7 sm:col-span-4 text-primary font-black flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                PDFForge (In-Browser)
              </div>
              <div className="hidden sm:block sm:col-span-4 text-muted-foreground">
                Other PDF Sites
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-border/60 text-xs sm:text-sm">
              {comparisonPoints.map((pt) => (
                <div
                  key={pt.feature}
                  className="grid grid-cols-12 items-center p-4 sm:p-5 transition-colors hover:bg-muted/15 gap-2 sm:gap-4"
                >
                  <div className="col-span-12 sm:col-span-4 font-bold text-foreground">
                    {pt.feature}
                  </div>
                  <div className="col-span-12 sm:col-span-4 flex items-start gap-2 font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                    <Check className="size-4 shrink-0 mt-0.5" />
                    <span>{pt.forge}</span>
                  </div>
                  <div className="col-span-12 sm:col-span-4 text-muted-foreground text-xs leading-relaxed pl-6 sm:pl-0">
                    <span className="sm:hidden font-semibold text-foreground/70 block mb-0.5">
                      Other PDF Sites:
                    </span>
                    {pt.cloud}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How it Works Workflow */}
      <section className="border-t py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <Layers className="size-3.5" />
                <span>SIMPLE WORKFLOW</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Three easy steps, zero setup required
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
                Work at full speed without installing desktop software, configuring drivers, or registering user accounts.
              </p>

              <div className="space-y-6 pt-2">
                {steps.map((st) => (
                  <div key={st.step} className="flex gap-4 group">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
                      {st.step}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {st.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10 shadow-xl backdrop-blur-xs">
                {/* Decorative background circle */}
                <div className="pointer-events-none absolute -right-12 -bottom-12 size-60 rounded-full bg-primary/10 blur-2xl" />

                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                  <FileCheck2 className="size-7" aria-hidden="true" />
                </div>

                <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
                  Your documents stay strictly yours
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  When you process a document with PDFForge, your device compiles the PDF locally.
                  There are no network uploads, no server queues, and zero cached backups left behind on remote machines.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md shadow-primary/20 gap-1.5"
                  >
                    <Link href="/tools">
                      Start using tools
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="rounded-xl font-semibold">
                    <Link href="/privacy">Read privacy policy</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              Everything you need to know about PDFForge and client-side PDF manipulation.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3.5">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-border/80 bg-card/90 shadow-2xs backdrop-blur-xs transition-all hover:border-primary/40 open:border-primary/50 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="shrink-0 transition-transform duration-300 group-open:rotate-180 text-muted-foreground group-hover:text-primary"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-3.5">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative border-t bg-gradient-to-b from-card via-background to-card py-20 sm:py-28 overflow-hidden">
        {/* Background Ambient Mesh */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/10 blur-3xl" />

        <Container className="relative text-center">
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              <span>READY TO BEGIN?</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl text-foreground">
              Ready to forge your PDFs?
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base max-w-lg mx-auto">
              Choose from {tools.length} powerful in-browser tools. No registration, no watermarks, completely free forever.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all gap-2"
              >
                <Link href="/tools">
                  Explore all {tools.length} tools
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base font-semibold rounded-2xl border-border/80 bg-card/60 backdrop-blur-xs hover:bg-muted/80 shadow-xs hover:scale-105 active:scale-95 transition-all"
              >
                <Link href="/tools/merge-pdf">
                  Merge PDFs now
                </Link>
              </Button>
            </div>

            {/* Micro Trust Seals */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                Zero Files Uploaded
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-4 text-primary" />
                Instant Local Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                100% Free Forever
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}