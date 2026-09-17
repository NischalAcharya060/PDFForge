"use client";

import { CheckCircle2, Download, FileArchive, RotateCcw } from "lucide-react";

import type { PdfToolResult } from "@/lib/types";
import { formatBytes } from "@/lib/format";
import { triggerDownload } from "@/lib/download";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function ResultPanel({
  result,
  onReset,
  downloadLabel = "Download",
}: {
  result: PdfToolResult;
  onReset: () => void;
  downloadLabel?: string;
}) {
  const reduced =
    result.savedPercent !== undefined && result.savedPercent > 0;

  return (
    <div aria-live="polite">
      <Card className="w-full border-primary/30">
        <CardContent className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {result.isZip ? (
                <FileArchive className="size-6" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="size-6" aria-hidden="true" />
              )}
            </span>
            <div>
              <p className="font-medium">
                {result.isZip ? "Your files are ready" : "Your file is ready"}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {result.filename}
              </p>
              <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Original size</dt>
                  <dd>{formatBytes(result.inputSize)}</dd>
                </div>
                <span aria-hidden="true">→</span>
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Output size</dt>
                  <dd className="font-medium text-foreground">
                    {formatBytes(result.size)}
                  </dd>
                </div>
                {reduced ? (
                  <dd className="font-medium text-emerald-600">
                    -{result.savedPercent}%
                  </dd>
                ) : null}
                {result.pageCount ? (
                  <dd>
                    · {result.pageCount}{" "}
                    {result.pageCount === 1 ? "page" : "pages"}
                  </dd>
                ) : null}
              </dl>
              {result.note ? (
                <p className="mt-2 text-sm text-muted-foreground">{result.note}</p>
              ) : null}
              {result.isZip ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  This ZIP contains multiple files.
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:w-auto">
            <Button size="lg" onClick={() => triggerDownload(result.blob, result.filename)}>
              <Download className="size-4" aria-hidden="true" />
              {downloadLabel}
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Process another file
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}