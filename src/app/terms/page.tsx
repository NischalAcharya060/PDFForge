import type { Metadata } from "next";
import { Scale } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Terms of Service | PDFForge",
  description: "Terms of Service for using the PDFForge platform and tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="relative isolate overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-25 mask-fade-b"
      />
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 -z-10 rounded-full bloom-primary-soft"
      />

      <Container className="max-w-3xl space-y-12">
        <Reveal className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-bold text-primary">
            <Scale className="size-4" />
            TERMS OF SERVICE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective Date: September 2026. Please read these terms carefully before using PDFForge.
          </p>
        </Reveal>

        <RevealGroup
          className="prose prose-sm space-y-6 text-sm leading-relaxed text-muted-foreground dark:prose-invert"
          step={70}
          y={20}
        >
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PDFForge, you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">2. Description of Service</h2>
            <p>
              PDFForge provides in-browser PDF manipulation tools including but not limited to merging,
              splitting, compressing, converting, editing, watermarking, and securing documents. The service
              is provided &ldquo;as is&rdquo; without warranty of any kind.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">3. User Responsibility & Ownership</h2>
            <p>
              You retain 100% of all intellectual property rights in and to the files you process. You are
              solely responsible for having lawful rights to manipulate and possess the documents you process
              with PDFForge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">4. Limitation of Liability</h2>
            <p>
              Because operations are executed locally within your client browser environment, PDFForge and its
              contributors shall not be liable for any damages, data loss, or corruption resulting from the
              use or inability to use this software. Always keep original backups of your critical documents.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">5. Modifications to Service</h2>
            <p>
              We reserve the right to modify, update, or discontinue any tool or feature at any time without
              prior notice.
            </p>
          </section>
        </RevealGroup>
      </Container>
    </div>
  );
}
