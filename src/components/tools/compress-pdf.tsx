"use client";

import { useCallback, useState } from "react";
import { FileArchive, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
import { compressPdf, type CompressionLevel } from "@/lib/pdf/compress";
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
import { Select } from "@/components/ui/select";

export default function CompressPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [level, setLevel] = useState<CompressionLevel>("balanced");
  const [maxCompression, setMaxCompression] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const bytes = await fileToArrayBuffer(file.file);

    const compact = await compressPdf(
      bytes,
      { level, maxCompression, onProgress: setMessage },
      file.name,
    );
    const blob = bytesToBlob(compact.bytes, "application/pdf");
    const note = compact.imageBased
      ? compact.savedPercent > 0
        ? "Pages were rasterized to JPEG images to maximize compression. Text in the result is no longer selectable."
        : "The file could not be reduced further and was returned unchanged."
      : compact.savedPercent > 0
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
  }, [files, level, maxCompression, setMessage]);

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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="compress-level" className="mb-2 block">
                      Compression level
                    </Label>
                    <Select
                      id="compress-level"
                      value={level}
                      disabled={maxCompression}
                      onChange={(event) =>
                        setLevel(event.target.value as CompressionLevel)
                      }
                    >
                      <option value="light">Light</option>
                      <option value="balanced">Balanced</option>
                      <option value="strong">Strong</option>
                    </Select>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Light re-serializes the document and keeps its properties. Balanced also
                      strips metadata; Strong removes XMP data too.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="compress-max"
                        checked={maxCompression}
                        onChange={(event) => setMaxCompression(event.target.checked)}
                      />
                      <Label htmlFor="compress-max" className="cursor-pointer">
                        Maximum compression (image-based)
                      </Label>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Renders every page to a JPEG for the smallest file size. Text becomes a
                      non-selectable image.
                    </p>
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