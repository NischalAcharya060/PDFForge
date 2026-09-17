"use client";

import { useCallback, useState } from "react";
import { Hash, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import {
  addPageNumbers,
  type PageNumberFormat,
  type PageNumberPosition,
} from "@/lib/pdf/page-numbers";
import { countPdfPages } from "@/lib/pdf/document";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { PdfDocumentPreview } from "@/components/pages/pdf-document-preview";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const positionGrid: { value: PageNumberPosition; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

export default function PageNumbersPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [format, setFormat] = useState<PageNumberFormat>("page-of-total");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAddFiles = useCallback(
    async (next: File[]) => {
      addFiles(next);
      if (next[0]) {
        try {
          const bytes = await fileToArrayBuffer(next[0]);
          const count = await countPdfPages(bytes, next[0].name);
          setPageCount(count);
        } catch {
          // ignore
        }
      }
    },
    [addFiles],
  );

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const bytes = await fileToArrayBuffer(file.file);
    const bytesOut = await addPageNumbers(
      bytes,
      { position, format, startNumber, fontSize },
      file.name,
      setMessage,
    );
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: file.size,
      pageCount,
    };
  }, [files, position, format, startNumber, fontSize, pageCount, setMessage, tool.slug]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    await run(process);
  }, [run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={handleAddFiles}
              hint="Stamp page numbers into your PDF with custom position and format."
            />
          ) : null}

          {files.length > 0 ? (
            <div className="flex flex-col gap-6">
              <FileList
                files={files}
                onRemove={removeFile}
                onClear={clearFiles}
                showPageCount
              />

              <ConfigurationPanel
                title="Page number settings"
                description={
                  pageCount > 0
                    ? `This document contains ${pageCount} pages.`
                    : "Configure positioning and appearance."
                }
              >
                <div>
                  <Label className="mb-2 block">Position on page</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {positionGrid.map((pos) => (
                      <button
                        key={pos.value}
                        type="button"
                        onClick={() => setPosition(pos.value)}
                        className={cn(
                          "rounded-lg border p-3 text-center text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          position === pos.value
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                            : "bg-card hover:bg-muted/40",
                        )}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="page-format" className="mb-2 block">
                      Numbering format
                    </Label>
                    <Select
                      id="page-format"
                      value={format}
                      onChange={(event) =>
                        setFormat(event.target.value as PageNumberFormat)
                      }
                    >
                      <option value="page-of-total">Page 1 of {pageCount || "n"}</option>
                      <option value="n-slash-total">1 / {pageCount || "n"}</option>
                      <option value="n-only">1 (number only)</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="page-start" className="mb-2 block">
                      First page number
                    </Label>
                    <Input
                      id="page-start"
                      type="number"
                      min={1}
                      value={startNumber}
                      onChange={(event) =>
                        setStartNumber(Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="page-font-size" className="mb-2 block">
                      Font size
                    </Label>
                    <Select
                      id="page-font-size"
                      value={String(fontSize)}
                      onChange={(event) => setFontSize(Number(event.target.value))}
                    >
                      <option value="9">Small (9 pt)</option>
                      <option value="10">Regular (10 pt)</option>
                      <option value="12">Large (12 pt)</option>
                      <option value="14">Extra Large (14 pt)</option>
                    </Select>
                  </div>
                </div>
              </ConfigurationPanel>

              {/* Preview Section */}
              <PdfDocumentPreview
                file={files[0].file}
                pageIndex={previewPageIndex}
                onPageChange={setPreviewPageIndex}
                onLoadInfo={({ pageCount: total }) => setPageCount(total)}
                title="Page Numbers Preview"
                subtitle="Live visual preview showing number placement and style on your document"
                renderOverlay={({ scale, pageIndex }) => {
                  const marginPx = Math.max(12, Math.round(32 * scale));
                  const currentNum = pageIndex + startNumber;
                  let text = `${currentNum}`;
                  if (format === "page-of-total") {
                    text = `Page ${currentNum} of ${pageCount || "n"}`;
                  } else if (format === "n-slash-total") {
                    text = `${currentNum} / ${pageCount || "n"}`;
                  }

                  const positionStyles: Record<PageNumberPosition, React.CSSProperties> = {
                    "top-left": { top: marginPx, left: marginPx },
                    "top-center": { top: marginPx, left: "50%", transform: "translateX(-50%)" },
                    "top-right": { top: marginPx, right: marginPx },
                    "bottom-left": { bottom: marginPx, left: marginPx },
                    "bottom-center": { bottom: marginPx, left: "50%", transform: "translateX(-50%)" },
                    "bottom-right": { bottom: marginPx, right: marginPx },
                  };

                  return (
                    <div
                      className="absolute pointer-events-none select-none transition-all duration-200"
                      style={{
                        ...positionStyles[position],
                        fontSize: `${Math.max(9, Math.round(fontSize * scale))}px`,
                        color: "rgb(60, 60, 60)",
                        fontFamily: "Helvetica, Arial, sans-serif",
                      }}
                    >
                      <span className="rounded bg-primary/15 px-2 py-0.5 font-medium text-primary ring-1 ring-primary/40 shadow-xs backdrop-blur-xs">
                        {text}
                      </span>
                    </div>
                  );
                }}
              />

              {error || localError ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{error ?? localError}</p>
                </div>
              ) : null}

              {status === "processing" ? (
                <ProcessingState message={message} />
              ) : null}
              {status === "completed" && result ? (
                <ResultPanel result={result} onReset={reset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={files.length === 0}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Hash className="size-4" aria-hidden="true" />
                  Add Page Numbers
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
