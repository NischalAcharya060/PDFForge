import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Terms of Service | PDFForge",
  description: "Terms of Service for using the PDFForge platform and tools.",
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective Date: September 2026. Please read these terms carefully before using PDFForge.
          </p>
        </div>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-sm text-muted-foreground leading-relaxed">
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
        </div>
      </Container>
    </div>
  );
}
