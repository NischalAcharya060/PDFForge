"use client";

import { useCallback, useRef, useState } from "react";
import { Image as ImageIcon, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool, createId } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { imagesToPdf, type PdfOrientation, type PdfPageSize } from "@/lib/pdf/images-to-pdf";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function PngToPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    maxFiles: 30,
  });

  const {
    files,
    status,
    message,
    result,
    error,
    addFileMetas,
    removeFile,
    clearFiles,
    reorderFiles,
    run,
    reset,
    setMessage,
  } = toolState;

  const [pageSize, setPageSize] = useState<PdfPageSize>("auto");
  const [orientation, setOrientation] = useState<PdfOrientation>("auto");
  const [margin, setMargin] = useState(0);
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});
  const urlsRef = useRef<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const revokeUrl = useCallback((url: string | undefined) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const removeThumbUrls = useCallback(
    (ids: string[]) => {
      for (const id of ids) revokeUrl(urlsRef.current[id]);
      setThumbUrls((previous) => {
        const next = { ...previous };
        for (const id of ids) delete next[id];
        return next;
      });
    },
    [revokeUrl],
  );

  const handleAddFiles = useCallback(
    (next: File[]) => {
      if (next.length === 0) return;
      const metas = next.map((file) => ({
        id: createId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      const urls: Record<string, string> = {};
      for (const meta of metas) {
        urls[meta.id] = URL.createObjectURL(meta.file);
      }
      Object.assign(urlsRef.current, urls);
      setThumbUrls((previous) => ({ ...previous, ...urls }));
      addFileMetas(metas);
    },
    [addFileMetas],
  );

  const handleRemoveFile = useCallback(
    (id: string) => {
      removeThumbUrls([id]);
      removeFile(id);
    },
    [removeThumbUrls, removeFile],
  );

  const handleClearFiles = useCallback(() => {
    removeThumbUrls(Object.keys(urlsRef.current));
    urlsRef.current = {};
    clearFiles();
  }, [removeThumbUrls, clearFiles]);

  const handleReset = useCallback(() => {
    removeThumbUrls(Object.keys(urlsRef.current));
    urlsRef.current = {};
    reset();
  }, [removeThumbUrls, reset]);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    if (files.length === 0) throw new Error("No PNG images selected.");
    const inputs = [];
    for (const file of files) {
      inputs.push({
        bytes: await fileToArrayBuffer(file.file),
        type: file.type || "image/png",
        name: file.name,
      });
    }
    const bytes = await imagesToPdf(inputs, { pageSize, orientation, margin }, setMessage);
    const blob = bytesToBlob(bytes, "application/pdf");
    return {
      blob,
      filename: outputFileName(files[0].name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: files.reduce((sum, f) => sum + f.size, 0),
      pageCount: files.length,
    };
  }, [files, pageSize, orientation, margin, setMessage, tool.slug]);

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
              multiple
              onFiles={handleAddFiles}
              hint="Convert PNG images into a clean, portable PDF document."
            />
          ) : null}

          {files.length > 0 ? (
            <div className="flex flex-col gap-6">
              <FileList
                files={files}
                onRemove={handleRemoveFile}
                onClear={handleClearFiles}
                onReorder={reorderFiles}
                thumbnails={thumbUrls}
              />

              <ConfigurationPanel
                title="Page setup"
                description="Configure page dimensions, orientation, and spacing for the converted PDF."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="page-size">Page Size</Label>
                    <Select
                      id="page-size"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as PdfPageSize)}
                    >
                      <option value="auto">Auto (match image size)</option>
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="letter">US Letter (8.5 × 11 in)</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select
                      id="orientation"
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as PdfOrientation)}
                    >
                      <option value="auto">Auto (per image)</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="margin">Margin</Label>
                    <Select
                      id="margin"
                      value={String(margin)}
                      onChange={(e) => setMargin(Number(e.target.value))}
                    >
                      <option value="0">No margin (edge-to-edge)</option>
                      <option value="20">Small (20 pt)</option>
                      <option value="40">Large (40 pt)</option>
                    </Select>
                  </div>
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
                <ResultPanel result={result} onReset={handleReset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" onClick={handleSubmit}>
                    <ImageIcon className="size-4" aria-hidden="true" />
                    Convert {files.length} {files.length === 1 ? "PNG" : "PNGs"} to PDF
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
