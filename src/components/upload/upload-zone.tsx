"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, Lock, Plus, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  accept: string[];
  multiple?: boolean;
  disabled?: boolean;
  compact?: boolean;
  hint?: string;
  buttonLabel?: string;
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
  buttonLabel,
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

  const defaultBtnLabel =
    buttonLabel ??
    (accept.includes("application/pdf")
      ? multiple
        ? "Select PDF files"
        : "Select PDF file"
      : multiple
        ? "Select images"
        : "Select image");

  const defaultHint = `or drop ${multiple ? "files" : "file"} here`;

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
          className="w-full h-11 border-dashed font-semibold hover:border-primary hover:text-primary gap-2 transition-all"
          onClick={openPicker}
          disabled={disabled}
        >
          <Plus className="size-4 text-primary" aria-hidden="true" />
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
        role="region"
        aria-label="File dropzone"
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/8 scale-[1.01] shadow-xl"
            : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 shadow-xs",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {/* Upload Icon badge */}
        <div className="relative mb-5">
          <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-xs ring-8 ring-primary/5">
            <UploadCloud className="size-10" aria-hidden="true" />
          </div>
        </div>

        {/* Primary iLovePDF-style Red Action Button */}
        <Button
          type="button"
          size="lg"
          onClick={openPicker}
          disabled={disabled}
          className="h-14 px-8 text-base font-bold shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl hover:scale-105 active:scale-95 transition-all gap-2.5 cursor-pointer"
        >
          <FileUp className="size-5" />
          {defaultBtnLabel}
        </Button>

        {/* Drag Hint */}
        <p className="mt-4 text-sm font-medium text-foreground/80">
          {hint ?? defaultHint}
        </p>

        {/* Format Badges & Privacy Guarantee */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          {accept.map((mime) => (
            <span
              key={mime}
              className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-[11px]"
            >
              {mime.replace("application/", ".").replace("image/", ".").toUpperCase()}
            </span>
          ))}
          <span className="text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1 font-medium text-muted-foreground">
            <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
            100% In-Browser & Private
          </span>
        </div>
      </div>
    </div>
  );
}