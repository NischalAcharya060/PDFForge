"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { FileText, GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";

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
}

export function FileList({
  files,
  onRemove,
  onClear,
  onReorder,
  thumbnails,
  showPageCount = false,
  disabled = false,
}: FileListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const move = useCallback(
    (index: number, direction: -1 | 1) => {
      if (!onReorder) return;
      const target = index + direction;
      if (target < 0 || target >= files.length) return;
      const next = [...files];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      onReorder(next.map((file) => file.id));
    },
    [files, onReorder],
  );

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

  if (files.length === 0) return null;

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-medium">
          {files.length} {files.length === 1 ? "file" : "files"}
        </p>
        {onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={disabled}
          >
            Clear all
          </Button>
        ) : null}
      </div>
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
              "flex items-center gap-3 px-4 py-3",
              draggedId === file.id && "opacity-50",
            )}
          >
            {onReorder ? (
              <span className="hidden shrink-0 text-muted-foreground/50 sm:inline-flex">
                <GripVertical className="size-4" aria-hidden="true" />
              </span>
            ) : null}
            <span className="w-6 shrink-0 text-center text-xs font-medium tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            {thumbnails?.[file.id] ? (
              <Image
                src={thumbnails[file.id]}
                alt={file.name}
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 shrink-0 rounded border object-cover"
              />
            ) : (
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4.5" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={file.name}>
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
            {onReorder ? (
              <span className="inline-flex shrink-0 gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Move ${file.name} up`}
                  onClick={() => move(index, -1)}
                  disabled={disabled || index === 0}
                >
                  <ChevronUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Move ${file.name} down`}
                  onClick={() => move(index, 1)}
                  disabled={disabled || index === files.length - 1}
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Button>
              </span>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
  );
}