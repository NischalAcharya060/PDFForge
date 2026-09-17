"use client";

import { useCallback, useState } from "react";
import { Check, Copy, FileText, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";

export default function PdfToTextTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetLocal = useCallback(() => {
    setExtractedText("");
    setCopied(false);
    setLocalError(null);
  }, []);

  const handleAddFiles = useCallback(
    (next: File[]) => {
      resetLocal();
      addFiles(next);
    },
    [addFiles, resetLocal],
  );

  const handleClearFiles = useCallback(() => {
    resetLocal();
    clearFiles();
  }, [clearFiles, resetLocal]);

  const handleRemoveFile = useCallback(
    (id: string) => {
      resetLocal();
      removeFile(id);
    },
    [removeFile, resetLocal],
  );

  const handleReset = useCallback(() => {
    resetLocal();
    reset();
  }, [reset, resetLocal]);

  const copyToClipboard = useCallback(async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [extractedText]);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const bytes = await fileToArrayBuffer(file.file);
    const { text, pageCount } = await extractPdfText(bytes, setMessage);

    setExtractedText(text);

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "txt"),
      size: blob.size,
      inputSize: file.size,
      pageCount,
      note: `Successfully extracted text from ${pageCount} ${pageCount === 1 ? "page" : "pages"}.`,
    };
  }, [files, setMessage, tool.slug]);

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
              hint="Extract all readable text from your PDF into a clean .txt document."
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
                <div className="space-y-6">
                  <ResultPanel result={result} onReset={handleReset} />

                  {/* Extracted Text Viewer */}
                  {extractedText ? (
                    <ConfigurationPanel
                      title="Extracted Text Preview"
                      description="Read, select, copy, or review the extracted document content."
                    >
                      <div className="space-y-3">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="gap-1.5 text-xs font-semibold"
                          >
                            {copied ? (
                              <>
                                <Check className="size-3.5 text-emerald-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" />
                                Copy to Clipboard
                              </>
                            )}
                          </Button>
                        </div>
                        <textarea
                          readOnly
                          value={extractedText}
                          rows={12}
                          className="w-full rounded-xl border bg-muted/20 p-4 font-mono text-xs leading-relaxed text-foreground shadow-inner focus:outline-hidden"
                        />
                      </div>
                    </ConfigurationPanel>
                  ) : null}
                </div>
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" onClick={handleSubmit}>
                    <FileText className="size-4" aria-hidden="true" />
                    Extract Text from PDF
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
