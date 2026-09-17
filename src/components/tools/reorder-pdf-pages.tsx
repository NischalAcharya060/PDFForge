"use client";

import { useCallback, useState } from "react";
import { ListOrdered, RotateCcw, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
import { reorderPdf } from "@/lib/pdf/reorder";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { PageThumbnails } from "@/components/pages/page-thumbnails";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { Button } from "@/components/ui/button";

export default function ReorderPdfPagesTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [order, setOrder] = useState<number[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const isDefaultOrder = (() => {
    if (order.length === 0) return true;
    return order.every((index, position) => index === position);
  })();

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    if (order.length === 0) throw new Error("No pages to arrange.");
    const bytes = await fileToArrayBuffer(file.file);
    const bytesOut = await reorderPdf(bytes, order, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: "reordered.pdf",
      size: blob.size,
      inputSize: file.size,
      pageCount: order.length,
    };
  }, [files, order]);

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
              onFiles={addFiles}
              hint="Drag pages into the order you want, or use the arrow buttons."
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

              <div>
                <PageThumbnails
                  file={files[0].file}
                  order={order}
                  onOrderChange={(next) => {
                    setOrder(next);
                    setLocalError(null);
                  }}
                  onLoadInfo={({ pageCount: total }) => {
                    setPageCount(total);
                    setOrder(Array.from({ length: total }, (_, i) => i));
                  }}
                  onError={setPreviewError}
                  selectLabel="Drag thumbnails to reorder, or use the arrows on each page."
                />
              </div>

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
                  <Button size="lg" onClick={handleSubmit} disabled={pageCount === 0}>
                    <ListOrdered className="size-4" aria-hidden="true" />
                    Save reordered PDF
                  </Button>
                  {!isDefaultOrder ? (
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() =>
                        setOrder(
                          Array.from({ length: pageCount }, (_, i) => i),
                        )
                      }
                    >
                      <RotateCcw className="size-4" aria-hidden="true" />
                      Reset order
                    </Button>
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