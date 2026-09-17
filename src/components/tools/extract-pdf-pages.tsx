"use client";

import { useCallback, useEffect, useState } from "react";
import { FileOutput, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { extractPages } from "@/lib/pdf/extract";
import { countPdfPages } from "@/lib/pdf/document";
import { parsePageRanges } from "@/lib/range";
import { formatPageList } from "@/lib/range";
import { bytesToBlob } from "@/lib/download";
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

type SelectionMode = "visual" | "ranges";

export default function ExtractPdfPagesTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [mode, setMode] = useState<SelectionMode>("visual");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [ranges, setRanges] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCount = selected.size;

  const resetPreview = useCallback(() => {
    setPageCount(0);
    setSelected(new Set());
    setRanges("");
    setPreviewError(null);
  }, []);

  useEffect(() => {
    if (files.length === 0) return;
    const file = files[0];
    fileToArrayBuffer(file.file)
      .then((bytes) => countPdfPages(bytes, file.name))
      .then(setPageCount)
      .catch(() => {
        // The thumbnail preview reports a friendlier error.
      });
  }, [files]);

  const handleAddFiles = useCallback(
    (added: File[]) => {
      resetPreview();
      addFiles(added);
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

    let indices: number[];
    if (mode === "ranges") {
      indices = parsePageRanges(ranges, pageCount);
    } else {
      indices = [...selected].sort((a, b) => a - b);
    }
    if (indices.length === 0) {
      throw new Error("Select the pages you want to keep.");
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
  }, [files, mode, ranges, pageCount, selected, tool.slug]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    if (mode === "ranges") {
      if (!ranges.trim()) {
        setLocalError("Enter a page range, e.g. 1-3, 5, 8-10.");
        return;
      }
      try {
        parsePageRanges(ranges, pageCount);
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : "Invalid range.");
        return;
      }
    } else if (selectedCount === 0) {
      setLocalError("Select at least one page to extract.");
      return;
    }
    await run(process);
  }, [mode, ranges, pageCount, selectedCount, run, process]);

  const previewLabel =
    mode === "visual"
      ? `${selectedCount} page${selectedCount === 1 ? "" : "s"} selected`
      : undefined;

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={handleAddFiles}
              hint="Pull the pages you want into a brand-new PDF."
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
                title="Choose pages"
                description={
                  pageCount > 0
                    ? `This document has ${pageCount} pages.`
                    : undefined
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setMode("visual")}
                    aria-pressed={mode === "visual"}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      mode === "visual"
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/40",
                    )}
                  >
                    <span className="font-medium">Select visually</span>
                    <span className="text-xs text-muted-foreground">
                      Tap the pages you want to keep.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("ranges")}
                    aria-pressed={mode === "ranges"}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      mode === "ranges"
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/40",
                    )}
                  >
                    <span className="font-medium">Enter page ranges</span>
                    <span className="text-xs text-muted-foreground">
                      e.g. 1-3, 5, 8-10.
                    </span>
                  </button>
                </div>

                {mode === "ranges" ? (
                  <div className="mt-4">
                    <Label htmlFor="extract-ranges" className="mb-2 block">
                      Page ranges
                    </Label>
                    <Input
                      id="extract-ranges"
                      value={ranges}
                      onChange={(event) => setRanges(event.target.value)}
                      placeholder="e.g. 1-3, 5, 8-10"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Extracted pages keep their original order.
                    </p>
                  </div>
                ) : null}

                {mode === "visual" ? (
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
                      onLoadInfo={({ pageCount: total }) => setPageCount(total)}
                      onError={setPreviewError}
                      selectLabel={previewLabel}
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
                <ResultPanel result={result} onReset={reset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={mode === "visual" && selectedCount === 0}
                  >
                    <FileOutput className="size-4" aria-hidden="true" />
                    {mode === "visual" && selectedCount > 0
                      ? `Extract ${selectedCount} ${selectedCount === 1 ? "page" : "pages"}`
                      : "Extract pages"}
                  </Button>
                  {mode === "visual" ? (
                    <p className="text-sm text-muted-foreground">
                      {formatPageList([...selected].sort((a, b) => a - b))
                        ? `Selected: ${formatPageList([...selected].sort((a, b) => a - b))}`
                        : "No pages selected yet."}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}