"use client";

import { useCallback, useState } from "react";
import { Grid, Eye, RotateCw, TriangleAlert, CheckCheck, XSquare } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
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
import { PdfDocumentPreview } from "@/components/pages/pdf-document-preview";
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
  const [previewMode, setPreviewMode] = useState<"grid" | "single">("grid");
  const [singlePageIndex, setSinglePageIndex] = useState(0);

  const selectedCount = selected.size;

  const handleSelectAll = useCallback(() => {
    setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  }, [pageCount]);

  const handleDeselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("Please add a file to get started — drag one into the upload area above.");
    const bytes = await fileToArrayBuffer(file.file);

    let targets: RotationMap;
    if (applyToAll) {
      const total = await countPdfPages(bytes, file.name);
      targets = rotationMapForAll(total, rotation);
    } else {
      targets = Object.fromEntries([...selected].map((index) => [index, rotation]));
    }

    if (Object.keys(targets).length === 0) {
      throw new Error("Select at least one page to rotate, then try again.");
    }

    const bytesOut = await rotatePdf(bytes, targets, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: file.size,
      pageCount,
    };
  }, [files, applyToAll, selected, pageCount, rotation, tool.slug]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    if (!applyToAll && selectedCount === 0) {
      setLocalError("Select at least one page to rotate, or choose to apply rotation to all pages.");
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

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rotate-all"
                      checked={applyToAll}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setApplyToAll(checked);
                        if (!checked && selected.size === 0) {
                          // Pre-select all pages when switching to manual so user doesn't face empty selection
                          setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));
                        }
                      }}
                    />
                    <Label htmlFor="rotate-all" className="cursor-pointer font-medium">
                      Apply rotation to all pages
                    </Label>
                  </div>

                  {!applyToAll && pageCount > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="h-7 text-xs"
                      >
                        <CheckCheck className="mr-1 size-3" />
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAll}
                        className="h-7 text-xs"
                      >
                        <XSquare className="mr-1 size-3" />
                        Deselect all
                      </Button>
                    </div>
                  ) : null}
                </div>
              </ConfigurationPanel>

              {/* Preview Section */}
              <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Page Preview</h3>
                    <p className="text-xs text-muted-foreground">
                      {applyToAll
                        ? `All ${pageCount || ""} pages will rotate by ${rotation}°`
                        : `${selectedCount} of ${pageCount} pages selected for rotation (click cards to toggle)`}
                    </p>
                  </div>

                  {/* View Mode Toggle: Grid vs Single Page */}
                  <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("grid")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors",
                        previewMode === "grid"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Grid className="size-3.5" />
                      All pages
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("single")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors",
                        previewMode === "single"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Eye className="size-3.5" />
                      Single page
                    </button>
                  </div>
                </div>

                {previewMode === "grid" ? (
                  <PageThumbnails
                    file={files[0].file}
                    selected={applyToAll ? undefined : selected}
                    onToggleSelection={(index) => {
                      if (applyToAll) {
                        setApplyToAll(false);
                        const next = new Set(Array.from({ length: pageCount }, (_, i) => i));
                        next.delete(index);
                        setSelected(next);
                        return;
                      }
                      setSelected((previous) => {
                        const next = new Set(previous);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      });
                    }}
                    onLoadInfo={({ pageCount: total }) => {
                      setPageCount(total);
                    }}
                    onError={setPreviewError}
                    pageRotation={(index) => (applyToAll || selected.has(index) ? rotation : 0)}
                  />
                ) : (
                  <PdfDocumentPreview
                    file={files[0].file}
                    pageIndex={singlePageIndex}
                    onPageChange={setSinglePageIndex}
                    rotation={applyToAll || selected.has(singlePageIndex) ? rotation : 0}
                    subtitle={`Previewing page ${singlePageIndex + 1} with ${
                      applyToAll || selected.has(singlePageIndex) ? `${rotation}° rotation` : "no rotation"
                    }`}
                  />
                )}
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