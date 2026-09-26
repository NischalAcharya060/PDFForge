"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import {
  destroyPdfDocument,
  openPdfForRendering,
  renderPageToCanvas,
  type RenderablePdf,
} from "@/lib/pdf/pdfjs";
import { fileToArrayBuffer } from "@/lib/files";
import { toErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PreviewOverlayInfo {
  pageIndex: number;
  pageNumber: number;
  pageCount: number;
  scale: number; // CSS pixels per PDF point
  displayWidth: number;
  displayHeight: number;
  baseWidth: number;
  baseHeight: number;
}

export interface PdfDocumentPreviewProps {
  file: File | null;
  pageIndex?: number;
  onPageChange?: (pageIndex: number) => void;
  onLoadInfo?: (info: { pageCount: number }) => void;
  renderOverlay?: (info: PreviewOverlayInfo) => React.ReactNode;
  rotation?: number;
  maxWidth?: number;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function PdfDocumentPreview({
  file,
  pageIndex: controlledPageIndex,
  onPageChange,
  onLoadInfo,
  renderOverlay,
  rotation = 0,
  maxWidth = 540,
  className,
  title,
  subtitle,
}: PdfDocumentPreviewProps) {
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isRenderingPage, setIsRenderingPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [dimensions, setDimensions] = useState<{
    displayWidth: number;
    displayHeight: number;
    baseWidth: number;
    baseHeight: number;
    scale: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const docRef = useRef<RenderablePdf | null>(null);

  // Keep callbacks fresh in refs
  const onLoadInfoRef = useRef(onLoadInfo);
  useEffect(() => {
    onLoadInfoRef.current = onLoadInfo;
  });

  const activePageIndex = controlledPageIndex ?? internalPageIndex;

  const handlePageChange = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || (pageCount > 0 && newIndex >= pageCount)) return;
      if (onPageChange) {
        onPageChange(newIndex);
      } else {
        setInternalPageIndex(newIndex);
      }
    },
    [pageCount, onPageChange],
  );

  // Load PDF Document when file changes
  useEffect(() => {
    if (!file) {
      if (docRef.current) {
        void destroyPdfDocument(docRef.current);
        docRef.current = null;
      }
      return;
    }

    let isCancelled = false;

    async function loadDoc() {
      setIsLoadingDoc(true);
      setErrorMessage(null);
      setPageCount(0);
      setDimensions(null);

      // Clean up previous doc
      if (docRef.current) {
        void destroyPdfDocument(docRef.current);
        docRef.current = null;
      }

      try {
        const bytes = await fileToArrayBuffer(file!);
        if (isCancelled) return;

        const doc = await openPdfForRendering(bytes);
        if (isCancelled) {
          void destroyPdfDocument(doc);
          return;
        }

        docRef.current = doc;
        setPageCount(doc.numPages);
        onLoadInfoRef.current?.({ pageCount: doc.numPages });
        setIsLoadingDoc(false);
      } catch (err) {
        if (!isCancelled) {
          setIsLoadingDoc(false);
          setErrorMessage(toErrorMessage(err));
          onLoadInfoRef.current?.({ pageCount: 0 });
        }
      }
    }

    void loadDoc();

    return () => {
      isCancelled = true;
      if (docRef.current) {
        void destroyPdfDocument(docRef.current);
        docRef.current = null;
      }
    };
  }, [file]);

  // Render current page onto canvas
  useEffect(() => {
    const doc = docRef.current;
    if (!doc || pageCount === 0) return;

    let isCancelled = false;

    async function renderPage() {
      setIsRenderingPage(true);
      try {
        const safePageNum = Math.min(Math.max(1, activePageIndex + 1), pageCount);
        const page = await doc!.getPage(safePageNum);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current?.clientWidth || maxWidth;
        const targetDisplayWidth = Math.min(maxWidth, Math.max(280, containerWidth - 32));
        const cssScale = targetDisplayWidth / baseViewport.width;
        const targetDisplayHeight = Math.round(baseViewport.height * cssScale);

        // Render at 1.5x resolution for sharpness on Retina displays
        const renderScale = cssScale * 1.5;
        await renderPageToCanvas({ canvas, page, scale: renderScale });

        if (!isCancelled) {
          setDimensions({
            displayWidth: targetDisplayWidth,
            displayHeight: targetDisplayHeight,
            baseWidth: baseViewport.width,
            baseHeight: baseViewport.height,
            scale: cssScale,
          });
          setIsRenderingPage(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setIsRenderingPage(false);
          console.error("Failed to render PDF page preview:", err);
        }
      }
    }

    void renderPage();

    return () => {
      isCancelled = true;
    };
  }, [file, pageCount, activePageIndex, maxWidth]);

  if (!file) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "surface relative isolate flex flex-col items-center overflow-hidden rounded-2xl border p-4 shadow-premium sm:p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-20 mask-radial-hero"
      />

      {/* Header / title bar */}
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          {title ? (
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          ) : null}
          {subtitle ? (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {/* Pagination controls */}
        {pageCount > 1 ? (
          <div className="glass flex items-center gap-1 rounded-xl border px-2 py-1 text-xs shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 text-foreground hover:bg-primary/10 hover:text-primary"
              disabled={activePageIndex <= 0 || isRenderingPage}
              onClick={() => handlePageChange(activePageIndex - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="min-w-16 text-center font-semibold tabular-nums text-foreground">
              {activePageIndex + 1} / {pageCount}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 text-foreground hover:bg-primary/10 hover:text-primary"
              disabled={activePageIndex >= pageCount - 1 || isRenderingPage}
              onClick={() => handlePageChange(activePageIndex + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Error state */}
      {errorMessage ? (
        <div className="w-full rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-center text-xs text-destructive">
          <p>We couldn&apos;t load the preview: {errorMessage}</p>
        </div>
      ) : null}

      {/* Loading document skeleton */}
      {isLoadingDoc && !errorMessage ? (
        <div className="flex h-72 w-full max-w-md items-center justify-center rounded-xl border border-dashed border-primary/25 bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Loading document preview…</span>
          </div>
        </div>
      ) : null}

      {/* Visual page canvas + overlay */}
      {!isLoadingDoc && !errorMessage ? (
        <div className="flex justify-center p-2">
          <div
            className="animate-fade-up relative overflow-hidden rounded-lg border border-border/70 bg-white shadow-premium-lg transition-all duration-500 ease-[var(--ease-premium)] dark:bg-zinc-950"
            style={{
              width: dimensions?.displayWidth ? `${dimensions.displayWidth}px` : undefined,
              height: dimensions?.displayHeight ? `${dimensions.displayHeight}px` : undefined,
              transform: rotation
                ? `rotate(${rotation}deg) scale(${rotation % 180 !== 0 ? 0.75 : 1})`
                : undefined,
            }}
          >
            <canvas
              ref={canvasRef}
              className="block w-full h-full object-contain"
              style={{
                width: dimensions?.displayWidth ? `${dimensions.displayWidth}px` : undefined,
                height: dimensions?.displayHeight ? `${dimensions.displayHeight}px` : undefined,
              }}
            />

            {/* Custom Interactive Overlay */}
            {dimensions && renderOverlay ? (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {renderOverlay({
                  pageIndex: activePageIndex,
                  pageNumber: activePageIndex + 1,
                  pageCount,
                  scale: dimensions.scale,
                  displayWidth: dimensions.displayWidth,
                  displayHeight: dimensions.displayHeight,
                  baseWidth: dimensions.baseWidth,
                  baseHeight: dimensions.baseHeight,
                })}
              </div>
            ) : null}

            {/* Page re-rendering indicator */}
            {isRenderingPage ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs transition-opacity">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
