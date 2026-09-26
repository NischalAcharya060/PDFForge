"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, Lock, Plus, ShieldCheck, UploadCloud } from "lucide-react";

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

const labelByMime: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
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
          className="press h-11 w-full gap-2 border-dashed bg-card/60 font-semibold backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
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
          "group relative isolate flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-500 ease-[var(--ease-premium)] sm:p-14",
          isDragging
            ? "scale-[1.01] border-primary bg-primary/8 shadow-premium-lg"
            : "border-border/80 bg-card/70 shadow-xs hover:border-primary/50 hover:bg-muted/25 hover:shadow-md",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {/* Ambient background wash */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent),transparent)] opacity-0 transition-opacity duration-700",
            isDragging ? "opacity-60" : "opacity-30",
          )}
        />
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-25 mask-radial-hero"
        />

        {/* Upload icon badge */}
        <div className="animate-fade-up relative mb-6">
          <div
            className={cn(
              "relative inline-flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-premium ring-1 ring-primary/20 transition-all duration-500 ease-[var(--ease-spring)]",
              "group-hover:-translate-y-1 group-hover:scale-105",
              isDragging && "-translate-y-1 scale-105 bg-primary text-primary-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-3xl bg-primary/20 pulse-ring"
            />
            <UploadCloud className="relative size-9" aria-hidden="true" />
          </div>
        </div>

        <Button
          type="button"
          size="xl"
          onClick={openPicker}
          disabled={disabled}
          className="shine-loop press group/btn h-14 cursor-pointer gap-2.5 rounded-2xl px-8 text-base font-bold shadow-premium-lg"
        >
          <FileUp
            className="size-5 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110"
            aria-hidden="true"
          />
          {defaultBtnLabel}
        </Button>

        {/* Drag hint */}
        <p
          className={cn(
            "mt-5 text-sm font-medium transition-colors duration-300",
            isDragging ? "text-primary" : "text-foreground/80",
          )}
        >
          {isDragging ? "Release to process locally" : (hint ?? defaultHint)}
        </p>

        {/* Format badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {accept.map((mime) => (
            <span
              key={mime}
              className="press rounded-lg border border-border/80 bg-background/70 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:text-primary"
            >
              {labelByMime[mime] ?? mime.replace("application/", ".").replace("image/", ".").toUpperCase()}
            </span>
          ))}
        </div>

        {/* Local-processing trust line */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border/50 pt-5 text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Never uploaded
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Closed when you leave
          </span>
        </div>
      </div>
    </div>
  );
}
