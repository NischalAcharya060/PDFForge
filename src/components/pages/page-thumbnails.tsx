"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import {
  destroyPdfDocument,
  openPdfForRendering,
  renderPageToCanvas,
} from "@/lib/pdf/pdfjs";
import { toErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MAX_THUMBNAIL_PAGES = 100;

export interface PageThumbnailsProps {
  file: File | null;
  order?: number[];
  onOrderChange?: (order: number[]) => void;
  selected?: Set<number>;
  onToggleSelection?: (index: number) => void;
  onLoadInfo?: (info: { pageCount: number }) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  selectLabel?: string;
}

interface ThumbState {
  index: number;
  status: "loading" | "ready" | "error";
  dataUrl?: string;
}

export function PageThumbnails({
  file,
  order,
  onOrderChange,
  selected,
  onToggleSelection,
  onLoadInfo,
  onError,
  disabled = false,
  selectLabel,
}: PageThumbnailsProps) {
  const [thumbs, setThumbs] = useState<ThumbState[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Store latest callbacks in refs so they never trigger effect re-runs
  const onLoadInfoRef = useRef(onLoadInfo);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onLoadInfoRef.current = onLoadInfo;
  });

  useEffect(() => {
    onErrorRef.current = onError;
  });

  const displayOrder =
    order && order.length > 0
      ? order
      : Array.from({ length: pageCount }, (_, i) => i);

  useEffect(() => {
    if (!file) {
      return;
    }

    let isCancelled = false;
    let currentDoc: Awaited<ReturnType<typeof openPdfForRendering>> | null = null;

    async function loadDocument(currentFile: File) {
      setIsLoadingDoc(true);
      setThumbs([]);
      setPageCount(0);

      try {
        const arrayBuffer = await currentFile.arrayBuffer();
        if (isCancelled) return;

        const doc = await openPdfForRendering(arrayBuffer);
        if (isCancelled) {
          void destroyPdfDocument(doc);
          return;
        }
        currentDoc = doc;

        const total = doc.numPages;
        if (total > MAX_THUMBNAIL_PAGES) {
          if (!isCancelled) {
            setThumbs([]);
            setPageCount(0);
            setIsLoadingDoc(false);
            onLoadInfoRef.current?.({ pageCount: 0 });
            onErrorRef.current?.(
              `This document has ${total} pages. The preview is limited to ${MAX_THUMBNAIL_PAGES} pages.`,
            );
          }
          return;
        }

        if (isCancelled) return;

        setPageCount(total);
        setIsLoadingDoc(false);
        onLoadInfoRef.current?.({ pageCount: total });
        setThumbs(
          Array.from({ length: total }, (_, i) => ({ index: i, status: "loading" })),
        );

        for (let i = 0; i < total; i++) {
          if (isCancelled) break;
          try {
            const pdfPage = await doc.getPage(i + 1);
            if (isCancelled) break;

            const canvasEl = document.createElement("canvas");
            await renderPageToCanvas({ canvas: canvasEl, page: pdfPage, scale: 0.32 });
            if (isCancelled) break;

            const dataUrl = canvasEl.toDataURL("image/png");
            if (isCancelled) break;

            setThumbs((previous) =>
              previous.map((thumb) =>
                thumb.index === i ? { ...thumb, status: "ready", dataUrl } : thumb,
              ),
            );
          } catch (err) {
            if (isCancelled) break;
            console.error(`Failed to render thumbnail for page ${i + 1}:`, err);
            setThumbs((previous) =>
              previous.map((thumb) =>
                thumb.index === i ? { ...thumb, status: "error" } : thumb,
              ),
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      } catch (error) {
        if (isCancelled) return;
        setThumbs([]);
        setPageCount(0);
        setIsLoadingDoc(false);
        onLoadInfoRef.current?.({ pageCount: 0 });
        onErrorRef.current?.(toErrorMessage(error));
      }
    }

    void loadDocument(file);

    return () => {
      isCancelled = true;
      if (currentDoc) {
        void destroyPdfDocument(currentDoc);
        currentDoc = null;
      }
    };
  }, [file]);

  const move = useCallback(
    (from: number, direction: -1 | 1) => {
      if (!onOrderChange) return;
      const target = from + direction;
      if (target < 0 || target >= displayOrder.length) return;
      const next = [...displayOrder];
      const [item] = next.splice(from, 1);
      next.splice(target, 0, item);
      onOrderChange(next);
    },
    [displayOrder, onOrderChange],
  );

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (!onOrderChange || draggedIndex === null || draggedIndex === targetIndex) {
        setDraggedIndex(null);
        return;
      }
      const next = [...displayOrder];
      const [item] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, item);
      onOrderChange(next);
      setDraggedIndex(null);
    },
    [displayOrder, draggedIndex, onOrderChange],
  );

  if (!file) {
    return (
      <div className="w-full rounded-xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          Preview appears here once a PDF is selected.
        </p>
      </div>
    );
  }

  if (isLoadingDoc || pageCount === 0) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-xl border bg-card p-8 text-center shadow-sm">
        <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Loading document preview...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {selectLabel ? (
        <p className="mb-3 text-sm text-muted-foreground">{selectLabel}</p>
      ) : null}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayOrder.map((originalIndex, displayIndex) => {
          const thumb = thumbs[originalIndex];
          const isSelected = selected?.has(originalIndex) ?? false;
          const isDragging = draggedIndex === displayIndex;
          return (
            <li
              key={originalIndex}
              draggable={!disabled && Boolean(onOrderChange)}
              onDragStart={() => setDraggedIndex(displayIndex)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(displayIndex)}
              onDragEnd={() => setDraggedIndex(null)}
              className="group relative"
            >
              <button
                type="button"
                onClick={() => onToggleSelection?.(originalIndex)}
                disabled={disabled}
                aria-pressed={onToggleSelection ? isSelected : undefined}
                aria-label={
                  onToggleSelection
                    ? `${isSelected ? "Deselect" : "Select"} page ${originalIndex + 1}`
                    : `Page ${originalIndex + 1}`
                }
                className={cn(
                  "flex w-full flex-col gap-2 rounded-lg border bg-card p-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  onToggleSelection && "cursor-pointer hover:border-primary/50",
                  isSelected &&
                    "border-primary bg-primary/5 ring-2 ring-primary/30",
                  isDragging && "opacity-40",
                  disabled && "cursor-default",
                )}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded border bg-muted/40">
                  {thumb?.status === "ready" && thumb.dataUrl ? (
                    <Image
                      src={thumb.dataUrl}
                      alt={`Preview of page ${originalIndex + 1}`}
                      fill
                      unoptimized
                      sizes="160px"
                      className="object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2
                        className="size-4 animate-spin text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {originalIndex + 1}
                  </span>
                  {onToggleSelection ? (
                    <span
                      className={cn(
                        "size-4 rounded-full border",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border",
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              </button>
              {onOrderChange ? (
                <span className="absolute inset-y-0 right-0 flex -translate-x-1 items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label={`Move page ${originalIndex + 1} earlier`}
                    onClick={() => move(displayIndex, -1)}
                    disabled={displayIndex === 0}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label={`Move page ${originalIndex + 1} later`}
                    onClick={() => move(displayIndex, 1)}
                    disabled={displayIndex === displayOrder.length - 1}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </Button>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}