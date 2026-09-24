import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  HardDrive,
  Info,
  Laptop,
  Layers,
  MonitorDown,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  SunMoon,
  WifiOff,
  Zap,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Download PDFForge Viewer for Windows — Free Offline PDF App",
  description:
    "Download PDFForge Viewer for Windows. A fast, private, offline desktop PDF viewer. Open, zoom, navigate, and print PDFs locally — no internet, no uploads, no account.",
  alternates: {
    canonical: "/download",
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/download`,
    title: "Download PDFForge Viewer for Windows — Free Offline PDF App",
    description:
      "A fast, private, offline desktop PDF viewer. Open, zoom, navigate, and print PDFs locally — no internet, no uploads, no account.",
  },
};

const downloadSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.desktop.name,
    operatingSystem: "Windows 10, Windows 11",
    applicationCategory: "UtilitiesApplication",
    softwareVersion: siteConfig.desktop.version,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: siteConfig.url,
    downloadUrl: siteConfig.desktop.downloadUrl.startsWith("http")
      ? siteConfig.desktop.downloadUrl
      : `${siteConfig.url}${siteConfig.desktop.downloadUrl}`,
    description:
      "A fast, private, offline desktop PDF viewer. Open, zoom, navigate, print, and organize PDFs entirely on your device.",
  },
];

const features = [
  {
    icon: WifiOff,
    title: "Works fully offline",
    description:
      "No internet connection required. Open and view PDFs anywhere, even on planes or in remote areas.",
  },
  {
    icon: ShieldCheck,
    title: "Files never leave your device",
    description:
      "All rendering happens locally. Your documents are never uploaded, logged, or stored anywhere.",
  },
  {
    icon: Zap,
    title: "Fast local rendering",
    description:
      "Built on Mozilla's pdf.js engine. Pages open instantly at full CPU speed — no loading spinners.",
  },
  {
    icon: FileCheck2,
    title: "Your default PDF viewer",
    description:
      "Associates with .pdf files in one click. Double-click any PDF and it opens right in PDFForge Viewer.",
  },
  {
    icon: Laptop,
    title: "Zoom, thumbnails & print",
    description:
      "Zoom, fit-to-width, page thumbnails, and system print support with keyboard shortcuts built in.",
  },
  {
    icon: HardDrive,
    title: "Lightweight & private",
    description:
      "A small, focused app with light and dark themes. No accounts, no telemetry, no bloat.",
  },
];

const highlights = [
  { icon: Eye, label: "PDF Viewing", detail: "Open & read any PDF" },
  { icon: Search, label: "Text Search", detail: "Find in document" },
  { icon: Layers, label: "Page Thumbnails", detail: "Visual navigation" },
  { icon: Printer, label: "System Print", detail: "Print to any printer" },
  { icon: SunMoon, label: "Dark & Light", detail: "Theme auto-switch" },
  { icon: FileCheck2, label: ".pdf Association", detail: "Double-click to open" },
];

const installSteps = [
  {
    step: "01",
    title: "Download the installer",
    description:
      "Click the download button to get the setup file. It's a single .exe — no extra dependencies.",
  },
  {
    step: "02",
    title: "Run & install",
    description:
      "Double-click the .exe to install. If SmartScreen appears, click \"More info\" → \"Run anyway\".",
  },
  {
    step: "03",
    title: "Open your PDFs",
    description:
      "Launch PDFForge Viewer or double-click any .pdf file. Everything runs offline from day one.",
  },
];

const faqs = [
  {
    question: "Is PDFForge Viewer really free?",
    answer:
      "Yes. It is completely free with no ads, no accounts, and no trial limits. Download and install it in under a minute.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "Windows 10 or Windows 11 (64-bit). The installer is about 123 MB and the app runs fine on modest hardware.",
  },
  {
    question: "My browser shows an 'unknown publisher' warning — what should I do?",
    answer:
      "The installer is not yet code-signed, so Windows SmartScreen may show a blue 'Windows protected your PC' prompt. Click 'More info', then 'Run anyway'. We are working on code signing.",
  },
  {
    question: "Will it work on Mac or Linux?",
    answer:
      "Not yet. The current release is Windows-only. Mac and Linux builds are on the roadmap.",
  },
  {
    question: "How do I update to a new version?",
    answer:
      "Download the latest installer from this page and run it over the old version. Your settings and file associations are preserved.",
  },
  {
    question: "Can I set it as my default PDF reader?",
    answer:
      "Yes. During installation or from Windows Settings → Default apps, you can associate .pdf files with PDFForge Viewer so all PDFs open with a double-click.",
  },
];

export default function DownloadPage() {
  return (
    <>
      {downloadSchemas.map((schema) => (
        <JsonLd key={(schema as { "@type": string })["@type"]} data={schema} />
      ))}

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-card/40 to-background pt-12 sm:pt-20 pb-16 sm:pb-24">
        {/* Background Dot Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)]" />

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 size-[680px] rounded-full bg-gradient-to-b from-primary/20 via-amber-500/10 to-transparent blur-3xl opacity-80" />

        <Container className="relative text-center">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-card/85 px-4 py-1.5 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md transition-all hover:border-primary/40">
            <MonitorDown className="size-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">
              Windows Desktop App •{" "}
              <strong className="text-foreground font-semibold">Free & Offline</strong>
            </span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground">
            The fastest way to{" "}
            <span className="relative inline-block whitespace-nowrap text-primary">
              <span className="relative z-10">read PDFs</span>
              <svg
                className="absolute -bottom-2 left-0 -z-0 h-3 w-full text-primary/30"
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
            </span>{" "}
            on your desktop
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            {siteConfig.desktop.name} is a fast, private, offline PDF viewer for Windows.
            Open, zoom, navigate, and print PDFs right from your files — no uploads, no
            account, no internet required.
          </p>

          {/* Meta Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 text-muted-foreground shadow-2xs backdrop-blur-xs">
              v{siteConfig.desktop.version}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 text-muted-foreground shadow-2xs backdrop-blur-xs">
              Windows 10 / 11
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 text-muted-foreground shadow-2xs backdrop-blur-xs">
              ~123 MB
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <CheckCircle2 className="size-3" />
              100% Free
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-14 px-9 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 rounded-2xl gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <a href={siteConfig.desktop.downloadUrl} download>
                <Download className="size-5" />
                Download for Windows
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-8 text-base font-semibold rounded-2xl border-border/80 bg-card/70 backdrop-blur-xs hover:bg-muted/80 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Link href="/tools">
                Use the online tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* SmartScreen notice */}
          <div className="mx-auto mt-6 max-w-xl flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 text-xs leading-relaxed text-foreground/80 text-left backdrop-blur-xs">
            <Info className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              SmartScreen may show an{" "}
              <strong className="text-foreground">&ldquo;unknown publisher&rdquo;</strong>{" "}
              warning because the installer is not yet code-signed. Click{" "}
              <strong className="text-foreground">More info → Run anyway</strong> to
              install.
            </span>
          </div>
        </Container>
      </section>

      {/* ─── Download Versions ─── */}
      <section className="border-b bg-muted/20 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Download className="size-3.5" />
              <span>ALL VERSIONS</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Every release, ready to download
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              Grab the latest build for the newest features, or stick with a previous release.
              Both installers run on Windows 10 and Windows 11.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {siteConfig.desktop.releases.map((release) => (
              <div
                key={release.version}
                className={`flex flex-col sm:flex-row sm:items-center gap-5 rounded-3xl border p-6 sm:p-7 backdrop-blur-xs transition-all ${
                  release.latest
                    ? "border-primary/40 bg-gradient-to-br from-primary/[0.07] via-card to-card shadow-lg shadow-primary/10"
                    : "border-border/80 bg-card/90 shadow-2xs hover:shadow-md"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-lg font-extrabold tracking-tight text-foreground">
                      v{release.version}
                    </span>
                    {release.latest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm shadow-primary/25">
                        <Check className="size-3" />
                        Latest
                      </span>
                    )}
                    <span className="text-xs font-semibold text-muted-foreground">
                      Released {release.released}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {release.note}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground/80">
                    {release.size} • {release.label}
                  </p>
                </div>
                <Button
                  size="lg"
                  asChild
                  variant={release.latest ? "default" : "outline"}
                  className={`w-full sm:w-auto h-12 px-6 text-sm font-bold rounded-2xl gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap ${
                    release.latest
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25"
                      : "border-primary/30 hover:bg-primary/5 hover:border-primary/50"
                  }`}
                >
                  <a href={release.url} download>
                    <Download className="size-4" />
                    Download v{release.version}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── What's New ─── */}
      {siteConfig.desktop.releases
        .filter((release) => release.latest && release.changes?.length)
        .map((release) => (
          <section key={`whats-new-${release.version}`} className="relative border-b py-16 sm:py-24 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 right-0 size-[420px] rounded-full bg-primary/10 blur-3xl" />
            <Container className="relative">
              <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14 space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Sparkles className="size-3.5" />
                  <span>WHAT&apos;S NEW</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  New in v{release.version}
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
                  {siteConfig.desktop.name} v{release.version} is a packed update — here&apos;s
                  everything that changed.
                </p>
              </div>

              <div className="mx-auto max-w-3xl grid gap-3 sm:grid-cols-2">
                {release.changes.map((change) => (
                  <div
                    key={change}
                    className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-foreground/90">
                      {change}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Button
                  size="lg"
                  asChild
                  className="h-14 px-9 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2.5"
                >
                  <a href={release.url} download>
                    <Download className="size-5" />
                    Download v{release.version}
                  </a>
                </Button>
              </div>
            </Container>
          </section>
        ))}

      {/* ─── Screenshot Showcase ─── */}
      <section className="relative border-b py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Eye className="size-3.5" />
              <span>SEE IT IN ACTION</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Clean, focused, distraction-free
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              A minimal interface designed to get out of your way. Dark theme by default, with
              a light theme one click away.
            </p>
          </div>

          {/* Dual Screenshot Showcase */}
          <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-2">
            {/* Screenshot 1: Idle / Welcome */}
            <div className="relative group">
              <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-lg transition-all group-hover:shadow-xl group-hover:border-primary/30">
                <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[10px] font-semibold text-muted-foreground">
                    Welcome Screen
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/viewer-idle.png"
                  alt={`${siteConfig.desktop.name} welcome screen with recent files and keyboard shortcuts`}
                  className="w-full aspect-[16/10] object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
                Welcome screen with recent files & keyboard shortcuts
              </p>
            </div>

            {/* Screenshot 2: Active PDF */}
            <div className="relative group">
              <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-lg transition-all group-hover:shadow-xl group-hover:border-primary/30">
                <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[10px] font-semibold text-muted-foreground">
                    Reading a PDF
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/viewer-open.png"
                  alt={`${siteConfig.desktop.name} showing an open PDF with zoom controls and page thumbnails`}
                  className="w-full aspect-[16/10] object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
                Reading a multi-page PDF with sidebar thumbnails
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Capability Highlights Grid ─── */}
      <section className="border-b py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Zap className="size-3.5" />
              <span>BUILT-IN CAPABILITIES</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Everything you need to read PDFs
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              {siteConfig.desktop.name} is designed to be fast, private, and effortless.
            </p>
          </div>

          {/* Compact Highlight Chips */}
          <div className="mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <h.icon className="size-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-foreground">{h.label}</div>
                  <div className="text-[11px] text-muted-foreground">{h.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Feature Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-3 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-bold text-base text-foreground">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Installation Steps ─── */}
      <section className="border-b bg-muted/20 py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <Clock className="size-3.5" />
                <span>SETUP IN 60 SECONDS</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Three steps to your new PDF viewer
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
                No accounts. No registration. No complex configuration. Just download, install,
                and start reading.
              </p>

              <div className="space-y-6 pt-2">
                {installSteps.map((st) => (
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

            {/* System Requirements Card */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10 shadow-xl backdrop-blur-xs">
                <div className="pointer-events-none absolute -right-12 -bottom-12 size-60 rounded-full bg-primary/10 blur-2xl" />

                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                  <Laptop className="size-7" aria-hidden="true" />
                </div>

                <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
                  System Requirements
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Runs smoothly on any modern Windows machine.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    { label: "Operating System", value: "Windows 10 / 11 (64-bit)" },
                    { label: "Disk Space", value: "~123 MB" },
                    { label: "RAM", value: "4 GB minimum (8 GB recommended)" },
                    { label: "Display", value: "1280×720 or higher" },
                    { label: "Internet", value: "Not required (fully offline)" },
                  ].map((req) => (
                    <div
                      key={req.label}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm"
                    >
                      <span className="font-semibold text-muted-foreground">{req.label}</span>
                      <span className="font-bold text-foreground">{req.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    size="lg"
                    asChild
                    className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2.5"
                  >
                    <a href={siteConfig.desktop.downloadUrl} download>
                      <Download className="size-5" />
                      Download {siteConfig.desktop.downloadLabel}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Web App Cross-Promo ─── */}
      <section className="border-b py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/90 bg-card shadow-xl">
            <div className="grid lg:grid-cols-2">
              <div className="border-b lg:border-b-0 lg:border-r border-border/80 p-6 sm:p-9">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary mb-4">
                  ALSO AVAILABLE
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  Prefer the browser?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The web app has all 18 PDF tools — merge, split, compress, convert, encrypt,
                  and more — and still runs 100% on your device with nothing uploaded.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "18 powerful PDF tools",
                    "Works on any device — desktop, tablet, mobile",
                    "No installation required",
                    "Same local-first privacy guarantee",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-foreground/90">
                      <Check className="size-4 shrink-0 mt-0.5 text-primary" />
                      <span className="font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-6 sm:p-9 text-center bg-gradient-to-br from-primary/5 to-transparent">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  No download required
                </span>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-14 px-8 text-base font-bold rounded-2xl border-primary/30 hover:bg-primary/5 hover:border-primary/50 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
                >
                  <Link href="/tools">
                    Browse all PDF tools
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                  100% free, unlimited, and processed locally on your device with instant speed.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-b bg-muted/20 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              Everything you need to know about {siteConfig.desktop.name}.
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

      {/* ─── Bottom CTA ─── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background Dot Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/10 blur-3xl" />

        <Container className="relative text-center">
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>YOUR PDFS, YOUR MACHINE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Ready to read PDFs offline?
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base max-w-lg mx-auto">
              Whether in your browser or as a desktop app, PDFForge never sends your documents
              anywhere. Download the viewer and start reading — it takes less than a minute.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-14 px-9 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2.5"
              >
                <a href={siteConfig.desktop.downloadUrl} download>
                  <Download className="size-5" />
                  Download {siteConfig.desktop.name}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 text-base font-semibold rounded-2xl border-border/80 bg-card/60 backdrop-blur-xs hover:bg-muted/80 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Link href="/tools">
                  Explore online tools
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Trust Seals */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                Zero Files Uploaded
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <WifiOff className="size-4 text-primary" />
                Works Offline
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-4 text-amber-500" />
                Instant Speed
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}