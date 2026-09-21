"use client";

import { useCallback, useEffect, useState } from "react";
import { FileImage, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { pdfToPng } from "@/lib/pdf/pdf-to-png";
import { bytesToBlob, createZipBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const MAX_PAGES = 80;

const RESOLUTION_OPTIONS = [
  { value: "1", label: "Standard (72 DPI) — Fastest, compact file size" },
  { value: "1.5", label: "High Resolution (108 DPI) — Recommended, balanced" },
  { value: "2", label: "Ultra Crisp (144 DPI) — Best for print & graphics" },
];

export default function PdfToPngTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [scale, setScale] = useState(1.5);
  const [pageCount, setPageCount] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetPreview = useCallback(() => {
    setPageCount(0);
    setLocalError(null);
  }, []);

  useEffect(() => {
    if (files.length === 0) return;
    const file = files[0];
    fileToArrayBuffer(file.file)
      .then(async (bytes) => {
        const pdfjs = await import("@/lib/pdf/pdfjs");
        const doc = await pdfjs.openPdfForRendering(bytes);
        setPageCount(doc.numPages);
        void pdfjs.destroyPdfDocument(doc);
      })
      .catch(() => {
        // progress UI will surface error
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
    if (!file) throw new Error("Please add a file to get started — drag one into the upload area above.");
    const bytes = await fileToArrayBuffer(file.file);
    const parts = await pdfToPng(bytes, { scale, maxPages: MAX_PAGES }, setMessage);

    if (parts.length === 1) {
      const blob = bytesToBlob(parts[0].bytes, "image/png");
      return {
        blob,
        filename: outputFileName(file.name, tool.slug, "png"),
        size: blob.size,
        inputSize: file.size,
        pageCount: 1,
      };
    }

    const blobs = parts.map((part) => ({
      name: part.name,
      blob: bytesToBlob(part.bytes, "image/png"),
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
  }, [files, scale, setMessage, tool.slug]);

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
              hint="Convert each page of your PDF into high-quality, lossless PNG images."
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
                title="Output Settings"
                description="Select the resolution for the generated PNG images."
              >
                <div className="space-y-1.5">
                  <Label htmlFor="png-scale">Rendering Quality &amp; DPI</Label>
                  <Select
                    id="png-scale"
                    value={String(scale)}
                    onChange={(e) => setScale(Number(e.target.value))}
                  >
                    {RESOLUTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pageCount > 1
                      ? `All ${pageCount} pages will be rendered as lossless PNGs and packaged in a ZIP archive.`
                      : "The page will be downloaded directly as a lossless PNG image."}
                  </p>
                </div>
              </ConfigurationPanel>

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
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" onClick={handleSubmit}>
                    <FileImage className="size-4" aria-hidden="true" />
                    Convert PDF to PNG
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
