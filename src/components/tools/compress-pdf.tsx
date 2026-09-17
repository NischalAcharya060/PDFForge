"use client";

import { useCallback, useState } from "react";
import { FileArchive, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
import { compressPdf } from "@/lib/pdf/compress";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CompressPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [stripMetadata, setStripMetadata] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const bytes = await fileToArrayBuffer(file.file);

    const compact = await compressPdf(bytes, { stripMetadata }, file.name);
    const blob = bytesToBlob(compact.bytes, "application/pdf");
    const note =
      compact.savedPercent > 0
        ? `The file was reduced by ${compact.savedPercent}%. Source images are not downsampled, so image-heavy documents may still be large.`
        : "This PDF could not be reduced further; the original file is returned.";

    return {
      blob,
      filename: "compressed.pdf",
      size: blob.size,
      inputSize: file.size,
      savedPercent: compact.savedPercent,
      note,
    };
  }, [files, stripMetadata]);

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
              hint="Optimize the structure of your PDF to slim it down."
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
                title="Compression options"
                description="All processing happens in your browser — your files never leave this device."
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="compress-strip-metadata"
                    checked={stripMetadata}
                    onChange={(event) => setStripMetadata(event.target.checked)}
                  />
                  <Label htmlFor="compress-strip-metadata" className="cursor-pointer">
                    Remove document metadata
                  </Label>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Stripping author, title, and producer fields also reduces size.
                </p>
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
                <Button size="lg" onClick={handleSubmit} disabled={files.length === 0}>
                  <FileArchive className="size-4" aria-hidden="true" />
                  Compress PDF
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}