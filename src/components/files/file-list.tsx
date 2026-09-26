"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  FileText,
  GripVertical,
  Trash2,
  ArrowUpDown,
  LayoutGrid,
  List,
  ArrowUpAZ,
  ArrowDownZA,
} from "lucide-react";

import type { FileWithMeta } from "@/lib/types";
import { formatBytes } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileListProps {
  files: FileWithMeta[];
  onRemove: (id: string) => void;
  onClear?: () => void;
  onReorder?: (ids: string[]) => void;
  thumbnails?: Record<string, string>;
  showPageCount?: boolean;
  disabled?: boolean;
  defaultView?: "grid" | "list";
}

export function FileList({
  files,
  onRemove,
  onClear,
  onReorder,
  thumbnails,
  showPageCount = false,
  disabled = false,
  defaultView = "grid",
}: FileListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(defaultView);

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (!onReorder || !draggedId) return;
      const from = files.findIndex((file) => file.id === draggedId);
      if (from === -1 || from === targetIndex) return;
      const next = [...files];
      const [item] = next.splice(from, 1);
      next.splice(targetIndex, 0, item);
      onReorder(next.map((file) => file.id));
      setDraggedId(null);
    },
    [draggedId, files, onReorder],
  );

  const sortAZ = useCallback(() => {
    if (!onReorder) return;
    const sorted = [...files].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
    );
    onReorder(sorted.map((f) => f.id));
  }, [files, onReorder]);

  const sortZA = useCallback(() => {
    if (!onReorder) return;
    const sorted = [...files].sort((a, b) =>
      b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: "base" }),
    );
    onReorder(sorted.map((f) => f.id));
  }, [files, onReorder]);

  const reverseOrder = useCallback(() => {
    if (!onReorder) return;
    const reversed = [...files].reverse();
    onReorder(reversed.map((f) => f.id));
  }, [files, onReorder]);

  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-3.5">
      {/* Action toolbar */}
      <div className="surface flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-2.5 shadow-xs sm:p-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {files.length}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {files.length === 1 ? "File loaded" : "Files loaded"}
          </span>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-1">
          {onReorder && files.length > 1 ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                onClick={sortAZ}
                title="Sort A to Z"
              >
                <ArrowUpAZ className="size-3.5" />
                <span className="hidden sm:inline">A-Z</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                onClick={sortZA}
                title="Sort Z to A"
              >
                <ArrowDownZA className="size-3.5" />
                <span className="hidden sm:inline">Z-A</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                onClick={reverseOrder}
                title="Reverse order"
              >
                <ArrowUpDown className="size-3.5" />
                <span className="hidden sm:inline">Reverse</span>
              </Button>
            </>
          ) : null}

          {/* View mode toggle */}
          <div className="ml-1 flex items-center gap-0.5 rounded-xl border border-border/70 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "press flex size-7 items-center justify-center rounded-lg transition-all duration-300",
                viewMode === "grid"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "press flex size-7 items-center justify-center rounded-lg transition-all duration-300",
                viewMode === "list"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="size-3.5" />
            </button>
          </div>

          {onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-8 px-2 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              onClick={onClear}
              disabled={disabled}
            >
              Clear all
            </Button>
          ) : null}
        </div>
      </div>

      {/* Grid mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file, index) => (
            <div
              key={file.id}
              draggable={!disabled && Boolean(onReorder)}
              onDragStart={() => setDraggedId(file.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDraggedId(null)}
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
              className={cn(
                "group animate-fade-up relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3 shadow-xs transition-all duration-400 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
                draggedId === file.id && "scale-95 border-dashed border-primary opacity-40",
              )}
            >
              {/* Order badge + remove */}
              <div className="mb-2 flex items-center justify-between">
                <span className="press flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {index + 1}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-muted-foreground opacity-70 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file.id)}
                  disabled={disabled}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Thumbnail / document preview */}
              <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/30 transition-colors duration-300 group-hover:border-primary/30">
                {thumbnails?.[file.id] ? (
                  <Image
                    src={thumbnails[file.id]}
                    alt={file.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-2 text-center">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-0.5 group-hover:scale-110">
                      <FileText className="size-5" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      PDF
                    </span>
                  </div>
                )}

                {/* Drag handle overlay */}
                {onReorder ? (
                  <div className="absolute inset-0 flex cursor-grab items-center justify-center bg-background/55 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100 active:cursor-grabbing">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-semibold shadow-md">
                      <GripVertical className="size-3.5 text-muted-foreground" />
                      Drag to order
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Filename & meta */}
              <div className="mt-2.5 min-w-0">
                <p className="truncate text-xs font-semibold text-foreground" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatBytes(file.size)}</span>
                  {showPageCount && file.pageCount ? (
                    <span>
                      {file.pageCount} {file.pageCount === 1 ? "page" : "pages"}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List mode */
        <div className="w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
          <ul className="divide-y divide-border/60">
            {files.map((file, index) => (
              <li
                key={file.id}
                draggable={!disabled && Boolean(onReorder)}
                onDragStart={() => setDraggedId(file.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => setDraggedId(null)}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 transition-colors duration-300 hover:bg-muted/25",
                  draggedId === file.id && "bg-primary/5 opacity-40",
                )}
              >
                {onReorder ? (
                  <span className="hidden shrink-0 cursor-grab text-muted-foreground/50 transition-colors group-hover:text-primary sm:inline-flex">
                    <GripVertical className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                {thumbnails?.[file.id] ? (
                  <Image
                    src={thumbnails[file.id]}
                    alt={file.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="size-10 shrink-0 rounded-lg border border-border/70 object-cover"
                  />
                ) : (
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold" title={file.name}>
                    {file.name}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                    {showPageCount && file.pageCount ? (
                      <span>
                        · {file.pageCount} {file.pageCount === 1 ? "page" : "pages"}
                      </span>
                    ) : null}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 shrink-0 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file.id)}
                  disabled={disabled}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
