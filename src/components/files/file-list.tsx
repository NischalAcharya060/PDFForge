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
    <div className="w-full space-y-3">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card/80 p-3 shadow-xs backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {files.length}
          </span>
          <span className="text-sm font-semibold">
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
                className="h-8 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
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
                className="h-8 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
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
                className="h-8 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                onClick={reverseOrder}
                title="Reverse order"
              >
                <ArrowUpDown className="size-3.5" />
                <span className="hidden sm:inline">Reverse</span>
              </Button>
            </>
          ) : null}

          {/* View Mode Toggle */}
          <div className="ml-1 flex items-center rounded-lg border bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded p-1 text-xs transition-colors",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded p-1 text-xs transition-colors",
                viewMode === "list"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="List view"
            >
              <List className="size-3.5" />
            </button>
          </div>

          {onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive transition-colors ml-1"
              onClick={onClear}
              disabled={disabled}
            >
              Clear all
            </Button>
          ) : null}
        </div>
      </div>

      {/* Grid Mode (iLovePDF Style) */}
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
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md",
                draggedId === file.id && "opacity-40 scale-95 border-dashed border-primary",
              )}
            >
              {/* Order Number Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {index + 1}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 opacity-60 hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file.id)}
                  disabled={disabled}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Thumbnail / Document Preview Card */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-muted/30 flex items-center justify-center">
                {thumbnails?.[file.id] ? (
                  <Image
                    src={thumbnails[file.id]}
                    alt={file.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      PDF
                    </span>
                  </div>
                )}

                {/* Drag Handle Overlay */}
                {onReorder ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing backdrop-blur-[1px]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-semibold shadow-md border">
                      <GripVertical className="size-3.5 text-muted-foreground" />
                      Drag to order
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Filename & Meta */}
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
        /* List Mode */
        <div className="w-full rounded-2xl border bg-card shadow-xs overflow-hidden">
          <ul className="divide-y">
            {files.map((file, index) => (
              <li
                key={file.id}
                draggable={!disabled && Boolean(onReorder)}
                onDragStart={() => setDraggedId(file.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => setDraggedId(null)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/20",
                  draggedId === file.id && "opacity-40",
                )}
              >
                {onReorder ? (
                  <span className="hidden shrink-0 text-muted-foreground/50 sm:inline-flex cursor-grab">
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
                    className="size-10 shrink-0 rounded-lg border object-cover"
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
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
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