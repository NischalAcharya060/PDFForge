"use client";

import { useCallback, useEffect, useState } from "react";
import { FileImage, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { pdfToImages } from "@/lib/pdf/pdf-to-images";
import { bytesToBlob, createZipBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MAX_PAGES = 80;

export default function PdfToJpgTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [quality, setQuality] = useState(0.8);
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
        // progress UI will surface any real error
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
    const parts = await pdfToImages(bytes, { quality, maxPages: MAX_PAGES }, setMessage);
    const blobs = parts.map((part) => ({
      name: part.name,
      blob: bytesToBlob(part.bytes, "image/jpeg"),
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
  }, [files, quality, setMessage, tool.slug]);

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
              hint="Render every PDF page as a JPG image, delivered in a ZIP."
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
                title="Image quality"
                description={
                  pageCount > 0
                    ? `${pageCount} page${pageCount === 1 ? "" : "s"} will be converted.`
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="quality" className="shrink-0">
                    JPG quality
                  </Label>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  id="quality"
                  type="range"
                  min={30}
                  max={100}
                  step={5}
                  value={Math.round(quality * 100)}
                  onChange={(event) => setQuality(Number(event.target.value) / 100)}
                  className="mt-3 w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
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
                <ResultPanel
                  result={{
                    ...result,
                    note: "A ZIP archive containing one JPG per page was created.",
                  }}
                  onReset={reset}
                />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <Button size="lg" onClick={handleSubmit} disabled={files.length === 0}>
                  <FileImage className="size-4" aria-hidden="true" />
                  Convert to JPG
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}