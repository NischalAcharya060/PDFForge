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

export default function JpgToPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    maxFiles: 20,
  });

  const { files, status, message, result, error, addFileMetas, removeFile, clearFiles, reorderFiles, run, reset, setMessage } = toolState;

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

  const process = useCallback(async (): Promise<PdfToolResult> => {
    if (files.length === 0) throw new Error("No images selected.");
    const inputs = [];
    for (const file of files) {
      inputs.push({
        bytes: await fileToArrayBuffer(file.file),
        type: file.type,
        name: file.name,
      });
    }
    const bytes = await imagesToPdf(inputs, { pageSize, orientation, margin }, setMessage);
    const blob = bytesToBlob(bytes, "application/pdf");
    return {
      blob,
      filename: outputFileName(files[0].name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: files.reduce((sum, file) => sum + file.size, 0),
      pageCount: files.length,
    };
  }, [files, pageSize, orientation, margin, setMessage, tool.slug]);

  const handleSubmit = useCallback(async () => {
    if (files.length === 0) {
      setLocalError("Add at least one image.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [files.length, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div>
            <UploadZone
              accept={tool.supportedExtensions}
              multiple
              onFiles={handleAddFiles}
              hint="Turn JPG, PNG, and WebP images into one PDF."
            />
            {files.length > 0 ? (
              <>
                <div className="mt-4">
                  <FileList
                    files={files}
                    thumbnails={thumbUrls}
                    onRemove={handleRemoveFile}
                    onClear={handleClearFiles}
                    onReorder={reorderFiles}
                  />
                </div>
                <div className="mt-4">
                  <UploadZone
                    accept={tool.supportedExtensions}
                    multiple
                    compact
                    onFiles={handleAddFiles}
                  />
                </div>
              </>
            ) : null}
          </div>

          {files.length > 0 ? (
            <ConfigurationPanel
              title="Layout"
              description="Page size, orientation, and margin for every page."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="jpg-page-size" className="mb-2 block">
                    Page size
                  </Label>
                  <Select
                    id="jpg-page-size"
                    value={pageSize}
                    onChange={(event) =>
                      setPageSize(event.target.value as PdfPageSize)
                    }
                  >
                    <option value="auto">Fit image</option>
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jpg-orientation" className="mb-2 block">
                    Orientation
                  </Label>
                  <Select
                    id="jpg-orientation"
                    value={orientation}
                    onChange={(event) =>
                      setOrientation(event.target.value as PdfOrientation)
                    }
                  >
                    <option value="auto">Auto</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jpg-margin" className="mb-2 block">
                    Margin
                  </Label>
                  <Select
                    id="jpg-margin"
                    value={String(margin)}
                    onChange={(event) => setMargin(Number(event.target.value))}
                  >
                    <option value="0">None</option>
                    <option value="24">Small</option>
                    <option value="48">Medium</option>
                    <option value="72">Large</option>
                  </Select>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {pageSize === "auto"
                  ? "Each page is sized to fit its image, up to A4."
                  : "Images are scaled to fit the page without loss of proportion."}
              </p>
            </ConfigurationPanel>
          ) : null}

          {error || localError ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>{error ?? localError}</p>
            </div>
          ) : null}

          {status === "processing" ? <ProcessingState message={message} /> : null}
          {status === "completed" && result ? (
            <ResultPanel result={result} onReset={reset} />
          ) : null}

          {status !== "processing" && status !== "completed" ? (
            <Button size="lg" onClick={handleSubmit} disabled={files.length === 0}>
              <ImageIcon className="size-4" aria-hidden="true" />
              Convert to PDF
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}