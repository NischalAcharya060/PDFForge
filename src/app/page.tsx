import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cpu,
  FileCheck2,
  Lock,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
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
    feature: "File Privacy",
    forge: "Processed in local RAM, never uploaded",
    cloud: "Uploaded to third-party cloud servers",
  },
  {
    feature: "Processing Speed",
    forge: "Instant (zero upload/download latency)",
    cloud: "Slow (waits for upload, queue, download)",
  },
  {
    feature: "Account Required",
    forge: "Never — 100% anonymous & unrestricted",
    cloud: "Often requires sign-up, email & cookies",
  },
  {
    feature: "File Size & Caps",
    forge: "No artificial limits, limited only by device",
    cloud: "Strict file caps unless on paid plans",
  },
  {
    feature: "Document Watermarking",
    forge: "Zero unwanted promotional watermarks",
    cloud: "Often stamps branding on free tier",
  },
];

const whyItems = [
  {
    icon: Lock,
    title: "100% Private by Design",
    description:
      "Every tool executes entirely in your local browser sandbox. Your confidential documents never travel across the internet.",
  },
  {
    icon: Zap,
    title: "Zero Queue & Blazing Fast",
    description:
      "No queues, no server cold starts. Operations complete as quickly as your CPU can crunch the bytes.",
  },
  {
    icon: MousePointerClick,
    title: "No Sign-Up or Accounts",
    description:
      "Instant access with zero friction. No credit cards, no login passwords, no email collection.",
  },
  {
    icon: Cpu,
    title: "Wasm & PDF-Lib Engine",
    description:
      "Built on state-of-the-art WebAssembly and modern PDF specifications for high fidelity without quality degradation.",
  },
];

const steps = [
  {
    step: "01",
    title: "Select your PDF",
    description: "Drag and drop your PDF or images into the tool dropzone.",
  },
  {
    step: "02",
    title: "Customize & Arrange",
    description: "Reorder pages, pick compression levels, or set custom security passwords.",
  },
  {
    step: "03",
    title: "Download instantly",
    description: "Save your freshly generated document directly to your device.",
  },
];

const faqs = [
  {
    question: "How does PDFForge process files without uploading them?",
    answer:
      "PDFForge uses modern browser capabilities — WebAssembly, ArrayBuffers, and JavaScript PDF engines — to read and manipulate files directly in your computer's RAM. The files never reach any server or external cloud storage.",
  },
  {
    question: "Is PDFForge truly free?",
    answer:
      "Yes. Because there are no server processing costs, all 18 basic and advanced PDF tools are 100% free with no hidden fees, no promotional watermarks, and no limits on file count.",
  },
  {
    question: "What is the maximum file size I can process?",
    answer:
      "Since processing happens locally, the only limit is your device's memory and browser tab limits. You can comfortably process multi-page documents and large multi-megabyte PDFs without restrictions.",
  },
  {
    question: "Which PDF tools are available on PDFForge?",
    answer:
      "PDFForge offers 18 free PDF tools: Merge, Split, Compress, Rotate, JPG to PDF, PDF to JPG, Delete Pages, Extract Pages, Reorder Pages, Protect with Password, Unlock PDF, Page Numbers, Watermark, Sign PDF, WebP to PDF, PNG to PDF, PDF to PNG, and PDF to Text.",
  },
  {
    question: "Can I use PDFForge on my phone or tablet?",
    answer:
      "Yes. PDFForge works in any modern mobile browser — iOS Safari and Android Chrome both supported — and scales responsively. No app install is needed to merge, compress, or convert PDFs on your mobile device.",
  },
  {
    question: "Do I need to install any software to use PDFForge?",
    answer:
      "No. PDFForge runs entirely in your web browser. There is nothing to download or install, and no account or sign-up is required to access the full suite of PDF tools.",
  },
  {
    question: "Is my data safe with PDFForge?",
    answer:
      "Absolutely. Your files are never uploaded anywhere — every operation runs in your browser's memory using client-side JavaScript and WebAssembly. Nothing is stored on a server, and we have no access to your documents.",
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
    itemListSchema(
      tools.map((t) => ({ name: t.name, slug: t.slug })),
    ),
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
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,var(--accent),transparent)] opacity-70" />
        <Container className="relative pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
          {/* Privacy Trust Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card/90 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs backdrop-blur-xs">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Files never leave your computer — 100% private in-browser</span>
          </div>

          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl text-foreground">
            Every tool you need to work with PDFs,{" "}
            <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
              all in one place
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Merge, split, compress, convert, watermark, and protect your PDF documents.
            100% free, unlimited, and processed locally on your device.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-13 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 rounded-2xl gap-2"
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
              className="h-13 px-8 text-base font-semibold rounded-2xl shadow-xs"
            >
              <Link href="#tools">Explore all {tools.length} tools</Link>
            </Button>
          </div>

          {/* Quick Tool Links */}
          <div className="mx-auto mt-12 max-w-4xl grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {popularTools.slice(0, 4).map((tool) => (
              <ToolQuickLink key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive Tool Browser (Search & Categories & Cards Grid) */}
      <HomeToolBrowser />

      {/* Why PDFForge vs Traditional Cloud Converters Matrix */}
      <section className="border-t bg-muted/30 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="size-3.5" />
              THE PRIVACY ADVANTAGE
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Why PDFForge is built different
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Traditional PDF websites upload your sensitive personal and work files to unknown cloud servers.
              PDFForge does everything right inside your browser.
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-md">
            <div className="grid grid-cols-3 border-b bg-muted/40 p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <div>Feature</div>
              <div className="text-primary font-black">PDFForge (Browser)</div>
              <div>Other PDF Sites</div>
            </div>
            <div className="divide-y text-xs sm:text-sm">
              {comparisonPoints.map((pt) => (
                <div key={pt.feature} className="grid grid-cols-3 items-center p-4 sm:p-5">
                  <div className="font-semibold text-foreground">{pt.feature}</div>
                  <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="size-4 shrink-0" />
                    <span>{pt.forge}</span>
                  </div>
                  <div className="text-muted-foreground">{pt.cloud}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Engineered for speed, privacy, and simplicity
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No bloated installs, no subscription walls, just pure productivity.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border bg-card p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <item.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-base tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it Works Workflow */}
      <section className="border-t bg-muted/30 py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
                HOW IT WORKS
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Three easy steps, zero setup required
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Get your PDF tasks finished in seconds without installing software or registering an account.
              </p>

              <div className="mt-8 space-y-6">
                {steps.map((st) => (
                  <div key={st.step} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-sm">
                      {st.step}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-foreground">{st.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-8 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -bottom-8 size-48 rounded-full bg-primary/5" />
              <FileCheck2 className="size-12 text-primary" aria-hidden="true" />
              <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                Your documents stay under your control
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                When you process a document with PDFForge, your device performs the PDF compilation locally.
                There are no network uploads, no server queues, and no cached backups left behind.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Button asChild className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                  <Link href="/tools">Start using tools →</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-xl">
                  <Link href="/privacy">Read privacy policy</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <section className="border-t py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to know about PDFForge and browser-based PDF processing.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border bg-card shadow-xs transition-colors"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="shrink-0 transition-transform group-open:rotate-180 text-muted-foreground group-hover:text-primary"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t bg-gradient-to-b from-card to-muted/30">
        <Container className="py-16 text-center sm:py-24">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Ready to forge your PDFs?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Choose from {tools.length} powerful PDF tools. No registration, no watermarks, completely free.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all gap-2"
              >
                <Link href="/tools">
                  Explore all tools
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}