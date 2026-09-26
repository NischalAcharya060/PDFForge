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
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { AnimatedUnderline } from "@/components/motion/animated-underline";
import { Spotlight } from "@/components/motion/spotlight";

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
  { icon: Printer, label: "Print Preview", detail: "Page range, copies & color" },
  { icon: SunMoon, label: "Multiple Themes", detail: "Dark, classic, minimal & custom" },
  { icon: FileCheck2, label: ".pdf Association", detail: "Double-click to open" },
];

const screenshots = [
  {
    src: "/screenshots/viewer-idle.png",
    label: "Welcome Screen",
    caption: "Jump right back into recent files with built-in keyboard shortcuts.",
    alt: "PDFForge Viewer welcome screen with recent files and keyboard shortcuts",
  },
  {
    src: "/screenshots/viewer-open.png",
    label: "Reading a PDF",
    caption: "Read multi-page PDFs with zoom, search, and a thumbnail sidebar.",
    alt: "PDFForge Viewer open on a multi-page PDF with zoom controls and page thumbnails",
  },
  {
    src: "/screenshots/new-document.png",
    label: "Create a PDF",
    caption: "Create new documents from rich text, plain text, or images in seconds.",
    alt: "PDFForge Viewer new document screen with rich text, plain text, and image creation options",
  },
  {
    src: "/screenshots/preference.png",
    label: "Settings & Themes",
    caption: "Tune themes, preferences, and default behaviors to match your workflow.",
    alt: "PDFForge Viewer preferences screen showing theme and app options",
  },
];

const screenshotChrome = (label: string) => (
  <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-2.5">
    <span className="size-2.5 rounded-full bg-red-500/80" />
    <span className="size-2.5 rounded-full bg-amber-500/80" />
    <span className="size-2.5 rounded-full bg-emerald-500/80" />
    <span className="ml-2 text-[10px] font-semibold text-muted-foreground">{label}</span>
  </div>
);

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
      <section className="relative isolate overflow-hidden border-b pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Background Dot Pattern */}
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-35 mask-radial-hero"
        />

        {/* Ambient Glow */}
        <div
          aria-hidden="true"
          className="animate-aurora pointer-events-none absolute -top-28 left-1/2 size-[680px] -translate-x-1/2 -z-10 rounded-full bloom-primary"
        />

        <Container className="relative text-center">
          {/* Badge */}
          <Reveal className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-card/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40">
            <MonitorDown className="size-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">
              Windows Desktop App •{" "}
              <strong className="font-semibold text-foreground">Free &amp; Offline</strong>
            </span>
          </Reveal>

          {/* Headline */}
          <Reveal delay={80}>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The fastest way to{" "}
              <AnimatedUnderline delay={420} className="whitespace-nowrap">
                read PDFs
              </AnimatedUnderline>{" "}
              on your desktop
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {siteConfig.desktop.name} is a fast, private, offline PDF viewer for Windows. Open,
              zoom, navigate, and print PDFs right from your files — no uploads, no account, no
              internet required.
            </p>
          </Reveal>

          {/* Meta Chips */}
          <RevealGroup
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            step={60}
            y={10}
          >
            <span className="press rounded-full border border-border/80 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
              v{siteConfig.desktop.version}
            </span>
            <span className="press rounded-full border border-border/80 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
              Windows 10 / 11
            </span>
            <span className="press rounded-full border border-border/80 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
              ~123 MB
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 shadow-2xs dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              100% Free
            </span>
          </RevealGroup>

          {/* CTA Buttons */}
          <Reveal delay={160} className="mt-8 sm:mt-10">
            <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Button
                size="xl"
                asChild
                className="shine-loop press group/dl h-14 w-full gap-2.5 rounded-2xl px-9 text-base font-bold shadow-premium-lg sm:w-auto"
              >
                <a href={siteConfig.desktop.downloadUrl} download>
                  <Download className="size-5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/dl:-translate-y-0.5" />
                  Download for Windows
                </a>
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
                className="press h-14 w-full gap-2 rounded-2xl border-border/80 bg-card/70 px-8 text-base font-semibold shadow-sm backdrop-blur-sm hover:bg-muted/80 sm:w-auto"
              >
                <Link href="/tools">
                  Use the online tools
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* SmartScreen notice */}
          <Reveal delay={220} className="mt-6">
            <div className="mx-auto flex max-w-xl items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 text-left text-xs leading-relaxed text-foreground/80 backdrop-blur-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                SmartScreen may show an{" "}
                <strong className="text-foreground">&ldquo;unknown publisher&rdquo;</strong>{" "}
                warning because the installer is not yet code-signed. Click{" "}
                <strong className="text-foreground">More info → Run anyway</strong> to install.
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── Download Versions ─── */}
      <section className="border-b bg-muted/20 py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <Download className="size-3.5" />
              <span>ALL VERSIONS</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Every release, ready to download
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Grab the latest build for the newest features, or stick with a previous release.
              Both installers run on Windows 10 and Windows 11.
            </p>
          </Reveal>

          <RevealGroup className="mx-auto max-w-3xl space-y-4" step={90} y={28}>
            {siteConfig.desktop.releases.map((release) => (
              <Spotlight
                key={release.version}
                className={`lift border-gradient-hover flex flex-col gap-5 rounded-3xl border p-6 transition-colors duration-300 sm:flex-row sm:items-center sm:p-7 ${
                  release.latest
                    ? "border-primary/40 bg-gradient-to-br from-primary/[0.07] via-card to-card shadow-premium"
                    : "border-border/80 bg-card/90 shadow-2xs hover:border-primary/30"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-lg font-extrabold tracking-tight text-foreground">
                      v{release.version}
                    </span>
                    {release.latest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-premium">
                        <Check className="size-3" />
                        Latest
                      </span>
                    )}
                    <span className="text-xs font-semibold text-muted-foreground">
                      Released {release.released}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {release.note}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground/80">
                    {release.size} • {release.label}
                  </p>
                </div>
                <Button
                  size="xl"
                  asChild
                  variant={release.latest ? "default" : "outline"}
                  className={`press h-12 w-full shrink-0 gap-2 whitespace-nowrap rounded-2xl px-6 text-sm font-bold transition-all duration-300 hover:scale-[1.02] sm:w-auto ${
                    release.latest
                      ? "shadow-premium-lg"
                      : "border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <a href={release.url} download>
                    <Download className="size-4" />
                    Download v{release.version}
                  </a>
                </Button>
              </Spotlight>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ─── What's New ─── */}
      {siteConfig.desktop.releases
        .filter((release) => release.latest && release.changes?.length)
        .map((release) => (
          <section
            key={`whats-new-${release.version}`}
            className="relative isolate overflow-hidden border-b py-16 sm:py-24"
          >
            <div
              aria-hidden="true"
              className="animate-aurora pointer-events-none absolute -right-40 -top-24 size-[420px] -z-10 rounded-full bloom-primary-soft"
            />
            <Container className="relative">
              <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
                  <Sparkles className="size-3.5" />
                  <span>WHAT&apos;S NEW</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  New in v{release.version}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {siteConfig.desktop.name} v{release.version} is a packed update — here&apos;s
                  everything that changed.
                </p>
              </Reveal>

              <RevealGroup
                className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2"
                step={60}
                y={16}
              >
                {release.changes.map((change) => (
                  <div
                    key={change}
                    className="lift flex items-start gap-3 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-2xs backdrop-blur-sm transition-all duration-400 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-foreground/90">
                      {change}
                    </span>
                  </div>
                ))}
              </RevealGroup>

              <Reveal delay={120} className="mt-10 text-center">
                <Button
                  size="xl"
                  asChild
                  className="press h-14 gap-2.5 rounded-2xl px-9 text-base font-bold shadow-premium-lg"
                >
                  <a href={release.url} download>
                    <Download className="size-5" />
                    Download v{release.version}
                  </a>
                </Button>
              </Reveal>
            </Container>
          </section>
        ))}

      {/* ─── Screenshot Showcase ─── */}
      <section className="relative isolate overflow-hidden border-b bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-30 mask-fade-b"
        />
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <Eye className="size-3.5" />
              <span>SEE IT IN ACTION</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Create, read, and organize — beautifully
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              A clean, fast interface that gets out of your way. View, create, and tune
              PDFForge Viewer to match exactly how you like to work.
            </p>
          </Reveal>

          {/* Uniform Screenshot Grid */}
          <RevealGroup
            className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2"
            step={90}
            y={32}
          >
            {screenshots.map((shot) => (
              <div key={shot.src} className="group relative">
                <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-primary/10 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
                <div className="lift relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-md transition-all duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-premium-lg">
                  {screenshotChrome(shot.label)}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent px-5 pb-4 pt-10 text-left transition-all duration-300 sm:translate-y-2 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-bold text-foreground">{shot.label}</p>
                    <p className="text-xs text-muted-foreground">{shot.caption}</p>
                  </div>
                </div>
                <p className="mt-3 px-1 text-left text-xs font-semibold text-muted-foreground sm:hidden">
                  {shot.caption}
                </p>
              </div>
            ))}
          </RevealGroup>

          {/* Mini trust strip under gallery */}
          <RevealGroup
            className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"
            step={70}
            y={10}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              No accounts, no telemetry
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-4 text-primary" />
              Instant open &amp; render
            </span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="size-4 text-primary" />
              100% offline
            </span>
          </RevealGroup>
        </Container>
      </section>

      {/* ─── Capability Highlights Grid ─── */}
      <section className="border-b py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <Zap className="size-3.5" />
              <span>BUILT-IN CAPABILITIES</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Everything you need to read PDFs
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {siteConfig.desktop.name} is designed to be fast, private, and effortless.
            </p>
          </Reveal>

          {/* Compact highlight chips */}
          <RevealGroup
            className="mx-auto mb-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3"
            step={55}
            y={14}
          >
            {highlights.map((h) => (
              <div
                key={h.label}
                className="lift flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-all duration-400 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 ease-[var(--ease-spring)]">
                  <h.icon className="size-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-foreground">{h.label}</div>
                  <div className="text-[11px] text-muted-foreground">{h.detail}</div>
                </div>
              </div>
            ))}
          </RevealGroup>

          {/* Detailed feature cards */}
          <RevealGroup
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            step={70}
            y={22}
          >
            {features.map((feature) => (
              <Spotlight
                key={feature.title}
                className="lift border-gradient-hover group space-y-3 rounded-3xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-400 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </Spotlight>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ─── Installation Steps ─── */}
      <section className="border-b bg-muted/20 py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="space-y-6 lg:col-span-6" x={-28}>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
                <Clock className="size-3.5" />
                <span>SETUP IN 60 SECONDS</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Three steps to your new PDF viewer
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                No accounts. No registration. No complex configuration. Just download, install,
                and start reading.
              </p>

              <div className="space-y-6 pt-2">
                {installSteps.map((st, index) => (
                  <div key={st.step} className="group/step flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-black text-sm text-primary-foreground shadow-premium transition-all duration-500 ease-[var(--ease-spring)] group-hover/step:-rotate-3 group-hover/step:scale-110">
                      {st.step}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground transition-colors duration-300 group-hover/step:text-primary">
                        <span
                          className="animate-fade-up inline-block"
                          style={{ animationDelay: `${index * 90}ms` }}
                        >
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

            {/* System Requirements Card */}
            <Reveal className="lg:col-span-6" x={28} delay={120}>
              <Spotlight className="lift border-gradient-hover relative isolate overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-8 shadow-premium-lg sm:p-10">
                <div
                  aria-hidden="true"
                  className="animate-float-slow pointer-events-none absolute -bottom-12 -right-12 size-60 rounded-full bloom-primary-soft"
                />

                <div className="relative">
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
                        className="press flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm backdrop-blur-sm transition-colors duration-300 hover:border-primary/30"
                      >
                        <span className="font-semibold text-muted-foreground">{req.label}</span>
                        <span className="font-bold text-foreground">{req.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      size="xl"
                      asChild
                      className="press h-14 w-full gap-2.5 rounded-2xl text-base font-bold shadow-premium-lg"
                    >
                      <a href={siteConfig.desktop.downloadUrl} download>
                        <Download className="size-5" />
                        Download {siteConfig.desktop.downloadLabel}
                      </a>
                    </Button>
                  </div>
                </div>
              </Spotlight>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─── Web App Cross-Promo ─── */}
      <section className="border-b py-16 sm:py-24">
        <Container>
          <Reveal delay={80} y={36}>
            <div className="surface mx-auto max-w-4xl overflow-hidden rounded-3xl border shadow-premium-lg">
              <div className="grid lg:grid-cols-2">
                <div className="border-b border-border/80 p-6 sm:p-9 lg:border-b-0 lg:border-r">
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[10px] font-bold text-primary">
                    ALSO AVAILABLE
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
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
                      <li
                        key={point}
                        className="group/pt flex items-start gap-2.5 text-foreground/90"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary transition-transform duration-300 ease-[var(--ease-spring)] group-hover/pt:scale-125" />
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center sm:p-9">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    No download required
                  </span>
                  <Button
                    size="xl"
                    variant="outline"
                    asChild
                    className="press group/btn h-14 gap-2 rounded-2xl border-primary/30 px-8 text-base font-bold shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Link href="/tools">
                      Browse all PDF tools
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                  <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                    100% free, unlimited, and processed locally on your device with instant speed.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-b bg-muted/20 py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Everything you need to know about {siteConfig.desktop.name}.
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

      {/* ─── Bottom CTA ─── */}
      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        {/* Background Dot Pattern */}
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-30 mask-fade-b"
        />
        <div
          aria-hidden="true"
          className="animate-aurora pointer-events-none absolute bottom-0 left-1/2 size-[600px] -translate-x-1/2 -z-10 rounded-full bloom-primary"
        />

        <Container className="relative text-center">
          <Reveal className="mx-auto max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>YOUR PDFS, YOUR MACHINE</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
              Ready to read PDFs offline?
            </h2>

            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Whether in your browser or as a desktop app, PDFForge never sends your documents
              anywhere. Download the viewer and start reading — it takes less than a minute.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
              <Button
                size="xl"
                asChild
                className="shine-loop press group/dl h-14 w-full gap-2.5 rounded-2xl px-9 text-base font-bold shadow-premium-lg sm:w-auto"
              >
                <a href={siteConfig.desktop.downloadUrl} download>
                  <Download className="size-5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/dl:-translate-y-0.5" />
                  Download {siteConfig.desktop.name}
                </a>
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
                className="press h-14 w-full gap-2 rounded-2xl border-border/80 bg-card/60 px-8 text-base font-semibold shadow-sm backdrop-blur-sm hover:bg-muted/80 sm:w-auto"
              >
                <Link href="/tools">
                  Explore online tools
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Trust Seals */}
            <RevealGroup
              className="flex flex-wrap items-center justify-center gap-4 pt-6 text-xs font-semibold text-muted-foreground"
              step={70}
              y={10}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                Zero Files Uploaded
              </span>
              <span className="flex items-center gap-1.5">
                <WifiOff className="size-4 text-primary" />
                Works Offline
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-4 text-amber-500" />
                Instant Speed
              </span>
            </RevealGroup>
          </Reveal>
        </Container>
      </section>
    </>
  );
}