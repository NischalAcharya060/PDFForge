"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Combine, FileCheck, Layers, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { mergePdfs } from "@/lib/pdf/merge";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { Button } from "@/components/ui/button";

export default function MergePdfTool({ tool }: { tool: ToolDefinition }) {
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
    addFiles,
    removeFile,
    clearFiles,
    reorderFiles,
    run,
    reset,
    setMessage,
  } = toolState;

  const [localError, setLocalError] = useState<string | null>(null);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const buffers: ArrayBuffer[] = [];
    for (const file of files) {
      buffers.push(await fileToArrayBuffer(file.file));
    }
    const bytes = await mergePdfs(buffers, setMessage);
    const blob = bytesToBlob(bytes, "application/pdf");
    return {
      blob,
      filename: outputFileName(files[0].name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: files.reduce((sum, file) => sum + file.size, 0),
    };
  }, [files, setMessage, tool.slug]);

  const handleSubmit = useCallback(async () => {
    if (files.length < 2) {
      setLocalError("Add at least two PDF files to merge, then try again.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [files.length, run, process]);

  return (
    <section>
      <Container className="py-8 sm:py-12">
        {files.length === 0 ? (
          /* Empty Initial Upload View */
          <div className="mx-auto max-w-2xl">
            <UploadZone
              accept={tool.supportedExtensions}
              multiple
              onFiles={addFiles}
              buttonLabel="Select PDF files"
              hint="or drop PDF files here to merge"
            />
          </div>
        ) : status === "completed" && result ? (
          /* Result View */
          <div className="mx-auto max-w-2xl">
            <ResultPanel result={result} onReset={reset} downloadLabel="Download merged PDF" />
          </div>
        ) : (
          /* Active Interactive Workspace (iLovePDF 2-Column Layout) */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] items-start">
            {/* Left: Card Grid Workspace */}
            <div className="space-y-4">
              <FileList
                files={files}
                onRemove={removeFile}
                onClear={clearFiles}
                onReorder={reorderFiles}
                showPageCount
              />

              {/* Add more files zone */}
              <div className="pt-2">
                <UploadZone
                  accept={tool.supportedExtensions}
                  multiple
                  compact
                  onFiles={addFiles}
                />
              </div>

              {error || localError ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{error ?? localError}</p>
                </div>
              ) : null}

              {status === "processing" ? (
                <div className="mt-6">
                  <ProcessingState message={message} />
                </div>
              ) : null}
            </div>

            {/* Right: Sticky Action Panel */}
            <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-md space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">Merge Options</h3>
                  <p className="text-xs text-muted-foreground">Order determines page sequence</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                  <span>Total documents</span>
                  <span className="font-bold text-foreground text-sm">{files.length}</span>
                </div>

                <div className="flex items-start gap-2 rounded-xl border bg-background/50 p-3 leading-relaxed">
                  <FileCheck className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Drag the cards on the left or use the <strong>A-Z</strong> buttons to arrange the
                    merge sequence.
                  </span>
                </div>
              </div>

              {/* Big Red Action Button */}
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={files.length < 2 || status === "processing"}
                className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 cursor-pointer"
              >
                <Combine className="size-5" />
                <span>Merge PDF</span>
                <ArrowRight className="size-4" />
              </Button>

              {files.length < 2 && (
                <p className="text-center text-[11px] text-muted-foreground">
                  Add at least 1 more file to enable merge
                </p>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}