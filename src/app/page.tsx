import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  Gauge,
  LockKeyhole,
  MousePointerClick,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { popularTools, tools } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { ToolCard, ToolQuickLink } from "@/components/home/tool-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/home/section-heading";

const whyItems = [
  {
    icon: LockKeyhole,
    title: "Private by design",
    description:
      "Every tool runs entirely in your browser. Your documents never get uploaded to a server.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description:
      "No queues, no waiting rooms. Processing happens locally, so results are immediate.",
  },
  {
    icon: MousePointerClick,
    title: "No sign-up required",
    description:
      "Start working right away. No accounts, no emails, no friction — just tools.",
  },
  {
    icon: Gauge,
    title: "Free and unlimited",
    description:
      "No file caps, no watermarks, no hidden fees. Use the tools as much as you need.",
  },
];

const steps = [
  {
    title: "Choose a tool",
    description: "Pick the operation you need — merge, split, convert, compress, and more.",
  },
  {
    title: "Add your files",
    description: "Drag and drop files from your device. Everything stays local.",
  },
  {
    title: "Download the result",
    description: "Review your new document and download it instantly.",
  },
];

const faqs = [
  {
    question: "Are my files safe?",
    answer:
      "Yes. PDFForge processes every document in your browser, on your device. Files are never uploaded to a server and never stored anywhere.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Every tool is available without an account. Processing is completely anonymous.",
  },
  {
    question: "How large can my files be?",
    answer:
      "Because everything runs in your browser, practically the limit is your device's memory. Very large PDFs may take longer to process.",
  },
  {
    question: "Which tools are available?",
    answer:
      "You can merge, split, compress, rotate, and secure PDFs, convert JPG to PDF and PDF to JPG, and delete, extract, or reorder pages.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--accent),transparent)] opacity-60" />
        <Container className="relative pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Files are processed in your browser — nothing is uploaded
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Your{" "}
            <span className="text-primary">PDF</span> workspace
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Simple tools for merging, splitting, converting, compressing, and
            managing PDF files — all private, all in your browser.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/tools">
                Open all tools
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#popular-tools">Explore popular tools</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-2.5 sm:mt-14 sm:grid-cols-4 sm:gap-3">
            {popularTools.map((tool) => (
              <ToolQuickLink key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      <SectionHeading
        id="popular-tools"
        eyebrow="Toolbox"
        title="Popular PDF tools"
        description="Everything you need to handle PDFs — no install, no upload."
      />
      <Container className="pb-16 sm:pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </Container>

      <section className="border-t bg-muted/40">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Why PDFForge"
            title="A workspace built for your documents"
            description="Premium tools without the compromises."
            align="left"
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t">
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="How it works"
                title="Three steps, zero fuss"
                align="left"
                className="mb-6"
              />
              <ol className="space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <FileCheck2
                className="size-10 text-primary"
                aria-hidden="true"
              />
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                Your files never leave your device
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                PDFForge is not a file transfer service. The processing engines
                run inside your browser, so documents stay on your computer
                from start to finish. Delete them whenever you like — there is
                nothing stored to worry about.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t bg-muted/40">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            className="mb-10"
          />
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border bg-card shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t">
        <Container className="py-16 text-center sm:py-24">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ready to forge your PDFs?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            Pick a tool and start working. No sign-up, no upload, no waiting.
          </p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/tools">
              Start now
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}