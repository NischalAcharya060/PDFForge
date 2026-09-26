"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  FileArchive,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Minimize2,
  Lock,
  Stamp,
} from "lucide-react";

import type { PdfToolResult } from "@/lib/types";
import { formatBytes } from "@/lib/format";
import { triggerDownload } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

const nextActions = [
  {
    href: "/tools/compress-pdf",
    label: "Compress",
    icon: Minimize2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/tools/protect-pdf",
    label: "Protect",
    icon: Lock,
    iconClass: "text-violet-600 dark:text-violet-400",
  },
  {
    href: "/tools/watermark-pdf",
    label: "Watermark",
    icon: Stamp,
    iconClass: "text-sky-600 dark:text-sky-400",
  },
];

export function ResultPanel({
  result,
  onReset,
  downloadLabel = "Download file",
}: {
  result: PdfToolResult;
  onReset: () => void;
  downloadLabel?: string;
}) {
  const [downloaded, setDownloaded] = useState(false);
  const reduced = result.savedPercent !== undefined && result.savedPercent > 0;

  const handleDownload = () => {
    triggerDownload(result.blob, result.filename);
    setDownloaded(true);
  };

  // Automatically trigger download on complete for seamless UX
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerDownload(result.blob, result.filename);
      setDownloaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [result.blob, result.filename]);

  return (
    <div aria-live="polite" className="w-full">
      <div className="surface relative isolate overflow-hidden rounded-3xl border p-8 text-center shadow-premium-lg sm:p-12">
        {/* Celebration ambient wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_50%_0%,var(--accent),transparent)] opacity-40"
        />
        <div
          aria-hidden="true"
          className="animate-aurora pointer-events-none absolute -left-24 -top-24 size-72 -z-10 rounded-full bloom-primary-soft"
        />

        {/* Success icon badge */}
        <div className="animate-scale-in relative mb-6 inline-block">
          <span className="relative inline-flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 shadow-premium ring-1 ring-emerald-500/25 dark:text-emerald-400">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-3xl bg-emerald-500/20 pulse-ring"
            />
            {result.isZip ? (
              <FileArchive className="relative size-10" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="relative size-10" aria-hidden="true" />
            )}
          </span>
          <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-premium">
            <Sparkles className="size-3.5 animate-spin-slow" />
          </span>
        </div>

        {/* Heading & file name */}
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {result.isZip ? "Your files are ready!" : "Your PDF is ready!"}
          </h2>
          <p className="mx-auto mt-2 max-w-md truncate text-sm font-medium text-muted-foreground">
            {result.filename}
          </p>
        </Reveal>

        {/* File metric chips */}
        <RevealGroup className="mt-5 flex flex-wrap items-center justify-center gap-2" step={70}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            Original: <strong className="text-foreground">{formatBytes(result.inputSize)}</strong>
          </span>
          <span className="text-muted-foreground/40" aria-hidden="true">
            →
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            New size: <strong>{formatBytes(result.size)}</strong>
          </span>
          {reduced && (
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Saved -{result.savedPercent}%
            </span>
          )}
          {result.pageCount ? (
            <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              {result.pageCount} {result.pageCount === 1 ? "page" : "pages"}
            </span>
          ) : null}
        </RevealGroup>

        {result.note && (
          <Reveal className="mt-4">
            <p className="mx-auto max-w-lg rounded-xl border border-border/70 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
              {result.note}
            </p>
          </Reveal>
        )}

        {/* Primary actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="xl"
            onClick={handleDownload}
            className="shine-loop press group/dl h-14 w-full cursor-pointer gap-2.5 rounded-2xl px-8 text-base font-bold shadow-premium-lg sm:w-auto"
          >
            <Download
              className="size-5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/dl:-translate-y-0.5 group-hover/dl:scale-110"
              aria-hidden="true"
            />
            {downloaded ? "Download again" : downloadLabel}
          </Button>

          <Button
            size="xl"
            variant="outline"
            onClick={onReset}
            className="press h-14 w-full gap-2 rounded-2xl border-border/80 bg-card/60 text-sm font-semibold backdrop-blur-sm hover:bg-muted/60 sm:w-auto sm:px-6"
          >
            <RotateCcw
              className="size-4 transition-transform duration-500 ease-[var(--ease-spring)] hover:rotate-180"
              aria-hidden="true"
            />
            Process another file
          </Button>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          The file was processed locally in your browser. Nothing was uploaded.
        </p>

        {/* Next-step recommendations */}
        {!result.isZip && (
          <Reveal className="mt-10 w-full max-w-xl border-t border-border/60 pt-6 text-left">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Next actions for your document
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {nextActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="lift group flex items-center justify-between rounded-xl border border-border/80 bg-background/70 p-3 text-xs font-semibold shadow-2xs backdrop-blur-sm transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="flex items-center gap-2">
                    <action.icon
                      className={`size-4 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110 ${action.iconClass}`}
                    />
                    {action.label}
                  </span>
                  <ArrowRight className="size-3 text-muted-foreground transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
