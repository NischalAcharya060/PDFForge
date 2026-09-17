"use client";

import { useCallback, useEffect, useState } from "react";
import { Scissors, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { countPdfPages } from "@/lib/pdf/document";
import { splitIntoGroups, splitIntoPages } from "@/lib/pdf/split";
import { extractPages } from "@/lib/pdf/extract";
import { parsePageRanges } from "@/lib/range";
import { bytesToBlob, createZipBlob } from "@/lib/download";
import { TooManyPages } from "@/lib/errors";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { PageThumbnails } from "@/components/pages/page-thumbnails";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SplitMode = "all" | "ranges" | "selected";

const MAX_OUTPUTS = 150;

const modeOptions: { value: SplitMode; label: string; hint: string }[] = [
  { value: "all", label: "Every page separately", hint: "One PDF per page, delivered as a ZIP." },
  { value: "ranges", label: "Custom ranges", hint: "e.g. 1-3, 5, 8-10 — each range becomes its own PDF." },
  { value: "selected", label: "Selected pages", hint: "Pick pages from the preview to keep." },
];

export default function SplitPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [mode, setMode] = useState<SplitMode>("all");
  const [ranges, setRanges] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCount = selected.size;
  const parsedSelected = useCallback(() => [...selected].sort((a, b) => a - b), [selected]);

  const resetPreview = useCallback(() => {
    setPageCount(0);
    setSelected(new Set());
    setRanges("");
    setPreviewError(null);
    setLocalError(null);
  }, []);

  useEffect(() => {
    if (files.length === 0) return;
    const file = files[0];
    fileToArrayBuffer(file.file)
      .then(async (bytes) => {
        const total = await countPdfPages(bytes, file.name);
        setPageCount(total);
        setMessage(`${total} pages detected`);
      })
      .catch((err) => {
        setPreviewError(err instanceof Error ? err.message : "Could not read this PDF.");
      });
  }, [files, setMessage]);

  const handleAddFiles = useCallback(
    (next: File[]) => {
      resetPreview();
      addFiles(next);
    },
    [addFiles, resetPreview],
  );

  const handleClearFiles = useCallback(() => {
    resetPreview();
    clearFiles();
  }, [clearFiles, resetPreview]);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const bytes = await fileToArrayBuffer(file.file);

    if (mode === "all") {
      if (pageCount > MAX_OUTPUTS) throw TooManyPages(MAX_OUTPUTS);
      const parts = await splitIntoPages(bytes, file.name, setMessage);
      const blobs = parts.map((part) => ({
        name: part.name,
        blob: bytesToBlob(part.bytes, "application/pdf"),
      }));
      const zipName = outputFileName(file.name, tool.slug, "zip");
      const zipBlob = await createZipBlob(blobs, setMessage);
      return {
        blob: zipBlob,
        filename: zipName,
        size: zipBlob.size,
        inputSize: file.size,
        isZip: true,
        pageCount: parts.length,
      };
    }

    if (mode === "ranges") {
      const groups: number[][] = [];
      for (const part of ranges.split(",")) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        const indices = parsePageRanges(trimmed, pageCount);
        if (indices.length === 0) continue;
        groups.push(indices);
      }
      if (groups.length === 0) {
        throw new Error("Enter at least one page or range, e.g. 1-3, 5, 8-10.");
      }
      if (groups.length > MAX_OUTPUTS) throw TooManyPages(MAX_OUTPUTS);
      const parts = await splitIntoGroups(bytes, groups, file.name, setMessage);
      const blobs = parts.map((part) => ({
        name: part.name,
        blob: bytesToBlob(part.bytes, "application/pdf"),
      }));
      const zipName = outputFileName(file.name, tool.slug, "zip");
      const zipBlob = await createZipBlob(blobs, setMessage);
      return {
        blob: zipBlob,
        filename: zipName,
        size: zipBlob.size,
        inputSize: file.size,
        isZip: true,
        pageCount: parts.length,
      };
    }

    const indices = parsedSelected();
    if (indices.length === 0) {
      throw new Error("Select at least one page to extract.");
    }
    const bytesOut = await extractPages(bytes, indices, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: file.size,
      pageCount: indices.length,
    };
  }, [files, mode, pageCount, ranges, parsedSelected, setMessage, tool.slug]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    if (mode === "ranges" && !ranges.trim()) {
      setLocalError("Enter a page range, e.g. 1-3, 5, 8-10.");
      return;
    }
    if (mode === "ranges") {
      try {
        parsePageRanges(ranges, pageCount);
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : "Invalid range.");
        return;
      }
    }
    if (mode === "selected" && selectedCount === 0) {
      setLocalError("Select at least one page.");
      return;
    }
    if (mode === "all" && pageCount > MAX_OUTPUTS) {
      setLocalError(
        `This PDF has ${pageCount} pages. You can split a maximum of ${MAX_OUTPUTS} pages here.`,
      );
      return;
    }
    await run(process);
  }, [mode, ranges, pageCount, selectedCount, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={handleAddFiles}
              hint="Split any PDF into separate files."
            />
          ) : null}

          {files.length > 0 ? (
            <div className="flex flex-col gap-6">
              <FileList
                files={files}
                onRemove={removeFile}
                onClear={handleClearFiles}
                showPageCount
              />

              <ConfigurationPanel
                title="How to split"
                description={
                  pageCount > 0
                    ? `This document has ${pageCount} pages.`
                    : undefined
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {modeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMode(option.value)}
                      aria-pressed={mode === option.value}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        mode === option.value
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/40",
                      )}
                    >
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs leading-relaxed text-muted-foreground">
                        {option.hint}
                      </span>
                    </button>
                  ))}
                </div>

                {mode === "ranges" ? (
                  <div className="mt-4">
                    <Label htmlFor="ranges-input" className="mb-2 block">
                      Page ranges
                    </Label>
                    <Input
                      id="ranges-input"
                      value={ranges}
                      onChange={(event) => setRanges(event.target.value)}
                      placeholder="e.g. 1-3, 5, 8-10"
                      inputMode="text"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Each comma-separated page or range becomes its own file.
                    </p>
                  </div>
                ) : null}

                {mode === "selected" ? (
                  <div className="mt-4">
                    <PageThumbnails
                      file={files[0].file}
                      selected={selected}
                      onToggleSelection={(index) =>
                        setSelected((previous) => {
                          const next = new Set(previous);
                          if (next.has(index)) next.delete(index);
                          else next.add(index);
                          return next;
                        })
                      }
                      onLoadInfo={({ pageCount: total }) => total > 0 && setPageCount(total)}
                      onError={setPreviewError}
                      selectLabel={`${selectedCount} page${selectedCount === 1 ? "" : "s"} selected`}
                    />
                  </div>
                ) : null}
              </ConfigurationPanel>

              {error || localError || previewError ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{error ?? localError ?? previewError}</p>
                </div>
              ) : null}

              {status === "processing" ? (
                <ProcessingState message={message} />
              ) : null}
              {status === "completed" && result ? (
                result.isZip ? (
                  <ResultPanel
                    result={{
                      ...result,
                      note: "A ZIP archive containing the split PDFs was created. Use the download button to save it.",
                    }}
                    onReset={reset}
                  />
                ) : (
                  <ResultPanel result={result} onReset={reset} />
                )
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={files.length === 0 || pageCount === 0}
                >
                  <Scissors className="size-4" aria-hidden="true" />
                  Split PDF
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}