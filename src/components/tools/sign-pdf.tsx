"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Image as ImageIcon,
  PenTool,
  RotateCcw,
  TriangleAlert,
  Type,
  Upload,
} from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { countPdfPages } from "@/lib/pdf/document";
import { openPdfForRendering, renderPageToCanvas, destroyPdfDocument } from "@/lib/pdf/pdfjs";
import { signPdf, type SignaturePlacement } from "@/lib/pdf/sign-pdf";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type SignatureMode = "draw" | "type" | "upload";

const PEN_COLORS = [
  { id: "black", label: "Black", color: "#0f172a" },
  { id: "blue", label: "Navy Blue", color: "#1d4ed8" },
  { id: "red", label: "Dark Red", color: "#b91c1c" },
];

const PEN_WIDTHS = [
  { id: "thin", label: "Thin", width: 2 },
  { id: "medium", label: "Normal", width: 3.5 },
  { id: "thick", label: "Bold", width: 5 },
];

const FONT_STYLES = [
  { id: "cursive1", name: "Elegant Script", font: "italic 38px 'Brush Script MT', cursive, sans-serif" },
  { id: "cursive2", name: "Classic Calligraphy", font: "italic bold 34px 'Lucida Handwriting', 'Segoe Script', cursive, sans-serif" },
  { id: "cursive3", name: "Modern Signature", font: "italic 32px 'Great Vibes', 'Caveat', cursive, sans-serif" },
];

export default function SignPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  // Document state
  const [pageCount, setPageCount] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageRendering, setPageRendering] = useState(false);

  // Signature creation state
  const [mode, setMode] = useState<SignatureMode>("draw");
  const [penColor, setPenColor] = useState("#0f172a");
  const [penWidth, setPenWidth] = useState(3.5);
  const [typedName, setTypedName] = useState("");
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0].id);
  const [uploadedSigUrl, setUploadedSigUrl] = useState<string | null>(null);
  const [drawnSigUrl, setDrawnSigUrl] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Placement state
  const [xPercent, setXPercent] = useState(60);
  const [yPercent, setYPercent] = useState(80);
  const [widthPercent, setWidthPercent] = useState(30);
  const [includeDate, setIncludeDate] = useState(true);
  const [dateText, setDateText] = useState(() => new Date().toISOString().split("T")[0]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Refs for drawing and preview
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingPlacementRef = useRef(false);

  // Reset tool
  const resetAll = useCallback(() => {
    reset();
    setPageCount(0);
    setCurrentPageIndex(0);
    setHasDrawn(false);
    setDrawnSigUrl(null);
    setUploadedSigUrl(null);
    setTypedName("");
    setLocalError(null);
  }, [reset]);

  const handleRemoveFile = useCallback(
    (id: string) => {
      resetAll();
      removeFile(id);
    },
    [resetAll, removeFile],
  );

  const handleClearFiles = useCallback(() => {
    resetAll();
    clearFiles();
  }, [resetAll, clearFiles]);

  // Load document page count when a file is selected
  useEffect(() => {
    if (files.length === 0) return;
    const file = files[0];
    let isCancelled = false;

    fileToArrayBuffer(file.file)
      .then((bytes) => countPdfPages(bytes, file.name))
      .then((total) => {
        if (!isCancelled) {
          setPageCount(total);
          setCurrentPageIndex(0);
        }
      })
      .catch(() => {
        // handled in main flow
      });

    return () => {
      isCancelled = true;
    };
  }, [files]);

  // Render current PDF page in the visual preview area
  useEffect(() => {
    if (files.length === 0 || pageCount === 0) return;
    const file = files[0];
    let isCancelled = false;
    let loadedDoc: Awaited<ReturnType<typeof openPdfForRendering>> | null = null;

    async function renderPreview() {
      setPageRendering(true);
      try {
        const bytes = await fileToArrayBuffer(file.file);
        if (isCancelled) return;
        const doc = await openPdfForRendering(bytes);
        if (isCancelled) {
          void destroyPdfDocument(doc);
          return;
        }
        loadedDoc = doc;

        const page = await doc.getPage(currentPageIndex + 1);
        if (isCancelled) return;

        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        // Render at a convenient display scale (width around 600px)
        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = Math.min(640, window.innerWidth - 64);
        const scale = targetWidth / baseViewport.width;

        await renderPageToCanvas({ canvas, page, scale });
        if (!isCancelled) {
          setPageRendering(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setPageRendering(false);
          console.error("Failed to render page preview:", err);
        }
      } finally {
        if (loadedDoc) {
          void destroyPdfDocument(loadedDoc);
        }
      }
    }

    void renderPreview();

    return () => {
      isCancelled = true;
      if (loadedDoc) {
        void destroyPdfDocument(loadedDoc);
      }
    };
  }, [files, pageCount, currentPageIndex]);

  // Handle Drawing Pad Logic
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    isDrawingRef.current = true;
    lastPointRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastPointRef.current = { x: currentX, y: currentY };
    setHasDrawn(true);
    setLocalError(null);
  }, [penColor, penWidth]);

  // Generate PNG data URL for typed signature when inputs change
  const typedSigUrl = useMemo(() => {
    if (!typedName.trim() || typeof document === "undefined") {
      return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const selectedFont = FONT_STYLES.find((f) => f.id === fontStyle)?.font || FONT_STYLES[0].font;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = selectedFont;
    ctx.fillStyle = penColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  }, [fontStyle, penColor, typedName]);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const canvas = drawCanvasRef.current;
    if (canvas) {
      setDrawnSigUrl(canvas.toDataURL("image/png"));
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setDrawnSigUrl(null);
  }, []);

  // Handle signature image upload
  const handleSignatureUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedSigUrl(reader.result);
        setLocalError(null);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Compute active signature data URL from pure state
  const activeSigDataUrl =
    mode === "draw" ? drawnSigUrl : mode === "type" ? typedSigUrl : uploadedSigUrl;

  // Preset placement locations
  const setPresetPlacement = useCallback((preset: "bottom-right" | "bottom-left" | "bottom-center" | "top-right") => {
    switch (preset) {
      case "bottom-right":
        setXPercent(65);
        setYPercent(82);
        break;
      case "bottom-left":
        setXPercent(8);
        setYPercent(82);
        break;
      case "bottom-center":
        setXPercent(36);
        setYPercent(82);
        break;
      case "top-right":
        setXPercent(65);
        setYPercent(12);
        break;
    }
  }, []);

  // Dragging placement on preview canvas
  const handlePlacementMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    isDraggingPlacementRef.current = true;
    const container = previewContainerRef.current;
    if (!container) return;

    const updateCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      const newXPct = Math.max(0, Math.min(100 - widthPercent, (clickX / rect.width) * 100));
      const newYPct = Math.max(0, Math.min(90, (clickY / rect.height) * 100));
      setXPercent(Math.round(newXPct));
      setYPercent(Math.round(newYPct));
    };

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    updateCoords(clientX, clientY);

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!isDraggingPlacementRef.current) return;
      const cX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const cY = "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      updateCoords(cX, cY);
    };

    const onUp = () => {
      isDraggingPlacementRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  }, [widthPercent]);

  // Submission process
  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");

    if (!activeSigDataUrl) {
      throw new Error("Please create, type, or upload your signature first.");
    }

    const bytes = await fileToArrayBuffer(file.file);
    const placement: SignaturePlacement = {
      pageIndex: currentPageIndex,
      xPercent,
      yPercent,
      widthPercent,
      includeDate,
      dateText: includeDate ? dateText : undefined,
    };

    const bytesOut = await signPdf(bytes, activeSigDataUrl, placement, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");

    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: file.size,
      pageCount,
      note: `Signature added to page ${currentPageIndex + 1}.`,
    };
  }, [files, activeSigDataUrl, currentPageIndex, xPercent, yPercent, widthPercent, includeDate, dateText, pageCount, tool.slug]);

  const handleSubmit = useCallback(async () => {
    if (!activeSigDataUrl) {
      setLocalError("Please draw, type, or upload a signature before submitting.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [activeSigDataUrl, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={addFiles}
              hint="Upload a PDF to sign electronically. 100% private, signed locally in your browser."
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

              {/* Signature Creation Workspace */}
              <ConfigurationPanel
                title="1. Create your signature"
                description="Choose whether to draw with pen/finger, type in cursive font, or upload a signature image."
              >
                {/* Tabs */}
                <div className="flex items-center gap-1.5 rounded-xl border bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => setMode("draw")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all",
                      mode === "draw"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <PenTool className="size-3.5" />
                    Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("type")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all",
                      mode === "type"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Type className="size-3.5" />
                    Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("upload")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all",
                      mode === "upload"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Upload className="size-3.5" />
                    Upload Image
                  </button>
                </div>

                {/* Draw Mode */}
                {mode === "draw" ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Pen Colors */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground mr-1">Color:</span>
                        {PEN_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setPenColor(c.color)}
                            title={c.label}
                            className={cn(
                              "size-7 rounded-full border-2 transition-transform",
                              penColor === c.color ? "scale-110 border-primary ring-2 ring-primary/20" : "border-border hover:scale-105",
                            )}
                            style={{ backgroundColor: c.color }}
                          />
                        ))}
                      </div>

                      {/* Pen Width */}
                      <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
                        {PEN_WIDTHS.map((w) => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => setPenWidth(w.width)}
                            className={cn(
                              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                              penWidth === w.width ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>

                      {/* Clear Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearCanvas}
                        className="text-xs text-muted-foreground hover:text-destructive gap-1"
                      >
                        <Eraser className="size-3.5" />
                        Clear
                      </Button>
                    </div>

                    {/* Canvas Pad */}
                    <div className="relative h-44 w-full overflow-hidden rounded-2xl border bg-white shadow-inner dark:bg-zinc-950">
                      <canvas
                        ref={drawCanvasRef}
                        width={600}
                        height={176}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="h-full w-full cursor-crosshair touch-none"
                      />
                      {!hasDrawn ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/40">
                          Sign here with mouse or touch
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {/* Type Mode */}
                {mode === "type" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="type-name">Your Full Name</Label>
                        <Input
                          id="type-name"
                          value={typedName}
                          onChange={(e) => {
                            setTypedName(e.target.value);
                            setLocalError(null);
                          }}
                          placeholder="e.g. Johnathan Doe"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Pen Ink Color</Label>
                        <div className="flex items-center gap-2 pt-1">
                          {PEN_COLORS.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setPenColor(c.color)}
                              title={c.label}
                              className={cn(
                                "size-8 rounded-full border-2 transition-transform",
                                penColor === c.color ? "scale-110 border-primary ring-2 ring-primary/20" : "border-border hover:scale-105",
                              )}
                              style={{ backgroundColor: c.color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Style selector cards */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {FONT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setFontStyle(style.id)}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all bg-card",
                            fontStyle === style.id
                              ? "border-primary ring-2 ring-primary/20 shadow-xs"
                              : "hover:border-primary/40 text-muted-foreground",
                          )}
                        >
                          <span
                            className="text-xl font-normal truncate max-w-full"
                            style={{ color: penColor, font: style.font }}
                          >
                            {typedName || "Signature"}
                          </span>
                          <span className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                            {style.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Upload Image Mode */}
                {mode === "upload" ? (
                  <div className="space-y-3">
                    {uploadedSigUrl ? (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-muted/20 p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedSigUrl}
                          alt="Uploaded signature"
                          className="max-h-24 object-contain rounded border bg-white p-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedSigUrl(null)}
                          className="text-xs text-muted-foreground hover:text-destructive gap-1"
                        >
                          <RotateCcw className="size-3.5" />
                          Choose another image
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <ImageIcon className="size-7 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">Upload signature image</p>
                          <p className="text-[11px] text-muted-foreground">PNG (transparent), JPG, or WebP</p>
                        </div>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={handleSignatureUpload}
                        />
                      </label>
                    )}
                  </div>
                ) : null}
              </ConfigurationPanel>

              {/* Placement & Page Selection */}
              <ConfigurationPanel
                title="2. Position on document"
                description="Click or drag on the page preview to position your signature, or select a preset."
              >
                {/* Page Navigation */}
                {pageCount > 1 ? (
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Select Page:</span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        Page {currentPageIndex + 1} of {pageCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPageIndex === 0}
                        onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                        className="size-8 p-0"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPageIndex >= pageCount - 1}
                        onClick={() => setCurrentPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                        className="size-8 p-0"
                        aria-label="Next page"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Placement Preset Buttons & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground mr-1">Presets:</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setPresetPlacement("bottom-right")}
                    >
                      Bottom Right
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setPresetPlacement("bottom-left")}
                    >
                      Bottom Left
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setPresetPlacement("bottom-center")}
                    >
                      Bottom Center
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setPresetPlacement("top-right")}
                    >
                      Top Right
                    </Button>
                  </div>

                  {/* Size slider */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Size:</span>
                    <input
                      type="range"
                      min="15"
                      max="50"
                      value={widthPercent}
                      onChange={(e) => setWidthPercent(Number(e.target.value))}
                      className="w-24 accent-primary"
                    />
                    <span className="font-mono text-[11px] text-muted-foreground">{widthPercent}%</span>
                  </div>
                </div>

                {/* Date stamp checkbox */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-muted/20 p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-date"
                      checked={includeDate}
                      onChange={(e) => setIncludeDate(e.target.checked)}
                    />
                    <Label htmlFor="include-date" className="text-xs cursor-pointer">
                      Include current date below signature
                    </Label>
                  </div>

                  {includeDate ? (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={dateText}
                        onChange={(e) => setDateText(e.target.value)}
                        className="h-7 w-32 text-xs"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Interactive Page Canvas with Signature Box Overlay */}
                <div className="flex justify-center rounded-2xl border bg-muted/10 p-4">
                  <div
                    ref={previewContainerRef}
                    onMouseDown={handlePlacementMouseDown}
                    onTouchStart={handlePlacementMouseDown}
                    className="relative cursor-crosshair overflow-hidden rounded-lg shadow-md select-none"
                    style={{ touchAction: "none" }}
                  >
                    <canvas ref={previewCanvasRef} className="block max-w-full" />

                    {/* Placed signature overlay badge */}
                    <div
                      className="absolute border-2 border-primary border-dashed bg-primary/10 rounded pointer-events-none flex flex-col items-center justify-center p-1 transition-all"
                      style={{
                        left: `${xPercent}%`,
                        top: `${yPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      {activeSigDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeSigDataUrl}
                          alt="Signature placement preview"
                          className="max-h-12 w-full object-contain pointer-events-none"
                        />
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                          <PenTool className="size-3" />
                          Signature
                        </div>
                      )}
                      {includeDate ? (
                        <span className="text-[9px] font-mono text-foreground/80 mt-0.5">
                          {dateText}
                        </span>
                      ) : null}
                    </div>

                    {pageRendering ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-xs">
                        <span className="text-xs font-semibold text-muted-foreground">Rendering page…</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </ConfigurationPanel>

              {/* Error messages */}
              {error || localError ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{error ?? localError}</p>
                </div>
              ) : null}

              {/* Processing status */}
              {status === "processing" ? (
                <ProcessingState message={message} />
              ) : null}

              {/* Result Download Panel */}
              {status === "completed" && result ? (
                <ResultPanel result={result} onReset={resetAll} />
              ) : null}

              {/* Action Button */}
              {status !== "processing" && status !== "completed" ? (
                <div className="flex items-center gap-3">
                  <Button size="lg" onClick={handleSubmit} className="gap-2">
                    <Check className="size-4" />
                    Sign &amp; Download PDF
                  </Button>
                  <Button variant="ghost" size="lg" onClick={resetAll}>
                    Cancel
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
