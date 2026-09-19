import type { Metadata } from "next";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Privacy Policy — 100% Client-Side Processing | PDFForge",
  description:
    "Read PDFForge's privacy policy. Learn how our zero-upload architecture ensures your documents never leave your computer.",
  alternates: {
    canonical: "/privacy",
  },
};

const guarantees = [
  "Zero document uploads: All PDF tasks run locally in your browser memory.",
  "Zero file storage: We operate no cloud buckets or databases containing your documents.",
  "No data logging or analytics profiling on document contents.",
  "Safe password handling: Document passwords for encryption/decryption are processed in memory only.",
  "No permanent tracking cookies or invasive third-party tracking.",
];

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" />
            PRIVACY FIRST ARCHITECTURE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Privacy Policy & Guarantees
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: September 2026. This policy outlines our absolute commitment to your privacy.
          </p>
        </div>

        {/* Guarantees Box */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Lock className="size-5 text-emerald-600" />
            Our Core Privacy Guarantees
          </h2>
          <ul className="space-y-2.5 text-sm text-foreground/90">
            {guarantees.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">1. How We Treat Your Files</h3>
            <p>
              When you select or drop a file into PDFForge, your browser parses the file into an in-memory
              ArrayBuffer. PDF manipulations (such as merging, splitting, compressing, or rotating) are
              executed by JavaScript and WebAssembly code running directly inside your browser session.
            </p>
            <p>
              Your documents are never transmitted over HTTP or WebSocket to any server or cloud API.
              Once you close or refresh your browser tab, the in-memory data is instantly released.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">2. Document Passwords</h3>
            <p>
              When using the &ldquo;Protect PDF&rdquo; tool, the password you enter is used by the
              in-browser encryption engine (using standard AES/RC4 algorithms) to compile the protected
              document. Passwords are never transmitted, stored, or logged anywhere.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">3. Analytics & Diagnostics</h3>
            <p>
              We may collect standard, anonymous web traffic telemetry (such as page views or general error
              codes) to improve platform reliability. We do not track document contents, filenames, or user identities.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-foreground">4. Contact</h3>
            <p>
              If you have any questions or security concerns regarding PDFForge, feel free to contact
              us at{" "}
              <a
                href="mailto:Nischal060@gmail.com"
                className="font-mono text-primary hover:underline"
              >
                Nischal060@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
