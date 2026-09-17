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
      <div className="flex flex-col items-center justify-center rounded-3xl border bg-card p-8 sm:p-12 text-center shadow-lg">
        {/* Success Icon Badge */}
        <div className="relative mb-5">
          <span className="inline-flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5 shadow-xs">
            {result.isZip ? (
              <FileArchive className="size-10" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="size-10" aria-hidden="true" />
            )}
          </span>
          <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md">
            <Sparkles className="size-3.5" />
          </span>
        </div>

        {/* Heading & File Name */}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          {result.isZip ? "Your files are ready!" : "Your PDF is ready!"}
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground max-w-md truncate">
          {result.filename}
        </p>

        {/* File Metric Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            Original: <strong className="text-foreground">{formatBytes(result.inputSize)}</strong>
          </span>
          <span className="text-muted-foreground/40">→</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground">
            New size: <strong>{formatBytes(result.size)}</strong>
          </span>
          {reduced && (
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Saved -{result.savedPercent}%
            </span>
          )}
          {result.pageCount ? (
            <span className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              {result.pageCount} {result.pageCount === 1 ? "page" : "pages"}
            </span>
          ) : null}
        </div>

        {result.note && (
          <p className="mt-4 max-w-lg text-xs leading-relaxed text-muted-foreground rounded-xl bg-muted/30 p-3 border">
            {result.note}
          </p>
        )}

        {/* Giant Red Action Download Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="lg"
            onClick={handleDownload}
            className="h-14 px-8 text-base font-bold shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl hover:scale-105 active:scale-95 transition-all gap-2.5 cursor-pointer w-full sm:w-auto"
          >
            <Download className="size-5" aria-hidden="true" />
            {downloaded ? "Download again" : downloadLabel}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
            className="h-14 px-6 text-sm font-semibold rounded-2xl gap-2 w-full sm:w-auto"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Process another file
          </Button>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          The file was processed locally in your browser. Nothing was uploaded.
        </p>

        {/* Next Step Recommendations (iLovePDF Style) */}
        {!result.isZip && (
          <div className="mt-10 w-full max-w-xl border-t pt-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Next actions for your document
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Link
                href="/tools/compress-pdf"
                className="group flex items-center justify-between rounded-xl border bg-background p-3 text-xs font-semibold shadow-xs hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Minimize2 className="size-4 text-emerald-600" />
                  Compress
                </span>
                <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tools/protect-pdf"
                className="group flex items-center justify-between rounded-xl border bg-background p-3 text-xs font-semibold shadow-xs hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lock className="size-4 text-violet-600" />
                  Protect
                </span>
                <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tools/watermark-pdf"
                className="group flex items-center justify-between rounded-xl border bg-background p-3 text-xs font-semibold shadow-xs hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Stamp className="size-4 text-sky-600" />
                  Watermark
                </span>
                <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}