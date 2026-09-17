"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  accept: string[];
  multiple?: boolean;
  disabled?: boolean;
  compact?: boolean;
  hint?: string;
}

const extensionByMime: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg,.jpeg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export function UploadZone({
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  compact = false,
  hint,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptAttribute = accept
    .map((mime) => [mime, extensionByMime[mime] ?? ""].filter(Boolean).join(","))
    .join(",");

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (files.length > 0) onFiles(files);
      event.target.value = "";
    },
    [onFiles],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const files = Array.from(event.dataTransfer.files ?? []);
      if (files.length > 0) onFiles(files);
    },
    [disabled, onFiles],
  );

  const defaultHint = `Drop ${multiple ? "files" : "a file"} here or select from your device. Everything stays on your computer.`;

  if (compact) {
    return (
      <div className="w-full">
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttribute}
          multiple={multiple}
          className="sr-only"
          onChange={handleInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={openPicker}
          disabled={disabled}
        >
          <FileUp className="size-4 text-primary" aria-hidden="true" />
          Add more files
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttribute}
        multiple={multiple}
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        role="button"
        tabIndex={0}
        aria-label="Select files"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onClick={openPicker}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-muted/40",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium">
          <span className="text-primary underline-offset-4 hover:underline">
            Select {multiple ? "files" : "a file"}
          </span>{" "}
          or drop {multiple ? "them" : "it"} here
        </p>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {hint ?? defaultHint}
        </p>
      </div>
    </div>
  );
}