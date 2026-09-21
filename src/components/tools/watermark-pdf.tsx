"use client";

import { useCallback, useState } from "react";
import { Stamp, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { addWatermark, type WatermarkColor } from "@/lib/pdf/watermark";
import { countPdfPages } from "@/lib/pdf/document";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { PdfDocumentPreview } from "@/components/pages/pdf-document-preview";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const colorStyleMap: Record<WatermarkColor, string> = {
  gray: "rgb(107, 114, 128)",
  red: "rgb(239, 68, 68)",
  black: "rgb(0, 0, 0)",
  blue: "rgb(37, 99, 235)",
};

const presetWords = ["CONFIDENTIAL", "DRAFT", "COPY", "INTERNAL ONLY", "SAMPLE"];

const angleOptions = [
  { value: 45, label: "45° Diagonal" },
  { value: 0, label: "0° Horizontal" },
  { value: -45, label: "-45° Reverse" },
  { value: 90, label: "90° Vertical" },
];

export default function WatermarkPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset, setMessage } = toolState;

  const [text, setText] = useState("CONFIDENTIAL");
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState<WatermarkColor>("gray");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(52);
  const [pageCount, setPageCount] = useState(0);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAddFiles = useCallback(
    async (next: File[]) => {
      addFiles(next);
      if (next[0]) {
        try {
          const bytes = await fileToArrayBuffer(next[0]);
          const count = await countPdfPages(bytes, next[0].name);
          setPageCount(count);
        } catch {
          // ignore
        }
      }
    },
    [addFiles],
  );

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("Please add a file to get started — drag one into the upload area above.");
    if (!text.trim()) throw new Error("Enter the watermark text you want to add, then try again.");
    const bytes = await fileToArrayBuffer(file.file);
    const bytesOut = await addWatermark(
      bytes,
      { text, rotation, color, opacity, fontSize },
      file.name,
      setMessage,
    );
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: file.size,
      pageCount,
    };
  }, [files, text, rotation, color, opacity, fontSize, pageCount, setMessage, tool.slug]);

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) {
      setLocalError("Please enter watermark text.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [text, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={handleAddFiles}
              hint="Stamp text watermarks across all pages of your PDF."
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
                title="Watermark settings"
                description={
                  pageCount > 0
                    ? `Will be applied across ${pageCount} pages.`
                    : "Configure text, opacity, and rotation."
                }
              >
                <div>
                  <Label htmlFor="watermark-text" className="mb-2 block">
                    Watermark text
                  </Label>
                  <Input
                    id="watermark-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {presetWords.map((word) => (
                      <button
                        key={word}
                        type="button"
                        onClick={() => setText(word)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs transition-colors",
                          text === word
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground",
                        )}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label htmlFor="wm-rotation" className="mb-2 block">
                      Angle
                    </Label>
                    <Select
                      id="wm-rotation"
                      value={String(rotation)}
                      onChange={(e) => setRotation(Number(e.target.value))}
                    >
                      {angleOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wm-opacity" className="mb-2 block">
                      Opacity
                    </Label>
                    <Select
                      id="wm-opacity"
                      value={String(opacity)}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                    >
                      <option value="0.15">Light (15%)</option>
                      <option value="0.25">Standard (25%)</option>
                      <option value="0.5">Medium (50%)</option>
                      <option value="0.75">Dark (75%)</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wm-color" className="mb-2 block">
                      Color
                    </Label>
                    <Select
                      id="wm-color"
                      value={color}
                      onChange={(e) => setColor(e.target.value as WatermarkColor)}
                    >
                      <option value="gray">Gray</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="black">Black</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wm-size" className="mb-2 block">
                      Font size
                    </Label>
                    <Select
                      id="wm-size"
                      value={String(fontSize)}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                    >
                      <option value="36">Medium (36 pt)</option>
                      <option value="52">Large (52 pt)</option>
                      <option value="72">Extra Large (72 pt)</option>
                    </Select>
                  </div>
                </div>
              </ConfigurationPanel>

              {/* Preview Section */}
              <PdfDocumentPreview
                file={files[0].file}
                pageIndex={previewPageIndex}
                onPageChange={setPreviewPageIndex}
                onLoadInfo={({ pageCount: total }) => setPageCount(total)}
                title="Watermark Preview"
                subtitle="Live visual preview showing your watermark placed across the document"
                renderOverlay={({ scale }) => (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span
                      className="font-bold tracking-wider text-center whitespace-nowrap transition-all duration-150"
                      style={{
                        fontSize: `${Math.max(12, Math.round(fontSize * scale))}px`,
                        color: colorStyleMap[color] || colorStyleMap.gray,
                        opacity,
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: "center center",
                        fontFamily: "Helvetica, Arial, sans-serif",
                      }}
                    >
                      {text || "CONFIDENTIAL"}
                    </span>
                  </div>
                )}
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
                <ResultPanel result={result} onReset={reset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={files.length === 0}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Stamp className="size-4" aria-hidden="true" />
                  Add Watermark
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
