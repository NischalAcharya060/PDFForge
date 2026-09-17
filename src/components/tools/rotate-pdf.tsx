"use client";

import { useCallback, useState } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
import { countPdfPages } from "@/lib/pdf/document";
import {
  rotationMapForAll,
  rotatePdf,
  type RotationDegrees,
  type RotationMap,
} from "@/lib/pdf/rotate";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { PageThumbnails } from "@/components/pages/page-thumbnails";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const rotationOptions: { value: RotationDegrees; label: string }[] = [
  { value: 90, label: "90° clockwise" },
  { value: 180, label: "180°" },
  { value: 270, label: "90° counter-clockwise" },
];

export default function RotatePdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [applyToAll, setApplyToAll] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState<RotationDegrees>(90);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCount = selected.size;

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    const bytes = await fileToArrayBuffer(file.file);

    let targets: RotationMap;
    if (applyToAll) {
      const total = await countPdfPages(bytes, file.name);
      targets = rotationMapForAll(total, rotation);
    } else {
      targets = Object.fromEntries([...selected].map((index) => [index, rotation]));
    }

    if (Object.keys(targets).length === 0) {
      throw new Error("Select at least one page to rotate.");
    }

    const bytesOut = await rotatePdf(bytes, targets, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: "rotated.pdf",
      size: blob.size,
      inputSize: file.size,
      pageCount,
    };
  }, [files, applyToAll, selected, pageCount, rotation]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    if (!applyToAll && selectedCount === 0) {
      setLocalError("Select the pages you want to rotate, or switch to all pages.");
      return;
    }
    await run(process);
  }, [applyToAll, selectedCount, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={addFiles}
              hint="Rotate pages clockwise, counter-clockwise, or a full half turn."
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

              <ConfigurationPanel title="Rotation settings">
                <div className="grid gap-3 sm:grid-cols-3">
                  {rotationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRotation(option.value)}
                      aria-pressed={rotation === option.value}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        rotation === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "hover:border-primary/40",
                      )}
                    >
                      <RotateCw className="size-4" aria-hidden="true" />
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Checkbox
                    id="rotate-all"
                    checked={applyToAll}
                    onChange={(event) => setApplyToAll(event.target.checked)}
                  />
                  <Label htmlFor="rotate-all" className="cursor-pointer">
                    Apply to all pages
                  </Label>
                </div>
              </ConfigurationPanel>

              {!applyToAll ? (
                <div>
                  <PageThumbnails
                    file={files[0].file}
                    selected={selected}
                    onToggleSelection={(index) =>
                      setSelected((previous) => {
                        const next = new Set(previous);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      })
                    }
                    onLoadInfo={({ pageCount: total }) => setPageCount(total)}
                    onError={setPreviewError}
                    selectLabel={`${selectedCount} page${selectedCount === 1 ? "" : "s"} selected for rotation`}
                  />
                </div>
              ) : null}

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
                <Button size="lg" onClick={handleSubmit} disabled={files.length === 0}>
                  <RotateCw className="size-4" aria-hidden="true" />
                  Rotate PDF
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}