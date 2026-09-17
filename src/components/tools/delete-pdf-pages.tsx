"use client";

import { useCallback, useState } from "react";
import { Trash2, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
import { deletePages } from "@/lib/pdf/delete-pages";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { PageThumbnails } from "@/components/pages/page-thumbnails";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { Button } from "@/components/ui/button";

export default function DeletePdfPagesTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pageCount, setPageCount] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCount = selected.size;

  const resetState = useCallback(() => {
    setSelected(new Set());
    setPageCount(0);
    setPreviewError(null);
    setLocalError(null);
  }, []);

  const handleAddFiles = useCallback(
    (newFiles: File[]) => {
      resetState();
      addFiles(newFiles);
    },
    [addFiles, resetState],
  );

  const handleRemoveFile = useCallback(
    (id: string) => {
      resetState();
      removeFile(id);
    },
    [removeFile, resetState],
  );

  const handleClearFiles = useCallback(() => {
    resetState();
    clearFiles();
  }, [clearFiles, resetState],
  );

  const handleReset = useCallback(() => {
    resetState();
    reset();
  }, [reset, resetState]);

  const handleLoadInfo = useCallback(
    ({ pageCount: total }: { pageCount: number }) => {
      setPageCount(total);
      setPreviewError(null);
    },
    [],
  );

  const togglePage = useCallback((index: number) => {
    setLocalError(null);
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const indices = [...selected].sort((a, b) => a - b);
    if (indices.length === 0) {
      throw new Error("Select the pages you want to delete.");
    }
    const bytes = await fileToArrayBuffer(file.file);
    const bytesOut = await deletePages(bytes, indices, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: "after-delete.pdf",
      size: blob.size,
      inputSize: file.size,
      pageCount: Math.max(0, (pageCount || 0) - indices.length),
    };
  }, [files, selected, pageCount]);

  const handleSubmit = useCallback(async () => {
    if (selectedCount === 0) {
      setLocalError("Select at least one page to delete.");
      return;
    }
    if (selectedCount >= pageCount) {
      setLocalError("You cannot delete every page. Keep at least one.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [selectedCount, pageCount, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={handleAddFiles}
              hint="Remove unwanted pages from a PDF. Keep pages are kept."
            />
          ) : null}

          {files.length > 0 ? (
            <div className="flex flex-col gap-6">
              <FileList
                files={files}
                onRemove={handleRemoveFile}
                onClear={handleClearFiles}
                showPageCount
              />

              <div>
                <PageThumbnails
                  file={files[0].file}
                  selected={selected}
                  onToggleSelection={togglePage}
                  onLoadInfo={handleLoadInfo}
                  onError={setPreviewError}
                  selectLabel={`${selectedCount} page${selectedCount === 1 ? "" : "s"} selected for deletion`}
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
                <ResultPanel result={result} onReset={handleReset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={selectedCount === 0}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete {selectedCount > 0 ? `${selectedCount} ` : ""}
                    {selectedCount === 1 ? "page" : "pages"}
                  </Button>
                  {selectedCount > 0 ? (
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        setSelected(new Set());
                        setLocalError(null);
                      }}
                    >
                      Clear selection
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