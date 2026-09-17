"use client";

import { useCallback, useState } from "react";
import { Combine, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
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
    maxFiles: 20,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, reorderFiles, run, reset, setMessage } = toolState;

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
      filename: "merged.pdf",
      size: blob.size,
      inputSize: files.reduce((sum, file) => sum + file.size, 0),
    };
  }, [files, setMessage]);

  const handleSubmit = useCallback(async () => {
    if (files.length < 2) {
      setLocalError("Add at least two PDF files to merge.");
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
              onFiles={addFiles}
              hint="Merge multiple PDFs into one. Drag files to set the order."
            />
            {files.length > 0 ? (
              <>
                <div className="mt-4">
                  <FileList
                    files={files}
                    onRemove={removeFile}
                    onClear={clearFiles}
                    onReorder={reorderFiles}
                  />
                </div>
                <div className="mt-4">
                  <UploadZone
                    accept={tool.supportedExtensions}
                    multiple
                    compact
                    onFiles={addFiles}
                  />
                </div>
              </>
            ) : null}
          </div>

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
            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={files.length < 2}
              >
                <Combine className="size-4" aria-hidden="true" />
                Merge PDFs
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}