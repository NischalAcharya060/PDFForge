"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  assertFileSize,
  assertFileType,
  sanitizeFilename,
} from "@/lib/files";
import { toErrorMessage } from "@/lib/errors";
import type {
  FileWithMeta,
  PdfToolResult,
  PdfToolStatus,
  RunContext,
} from "@/lib/types";

export interface UsePdfToolOptions {
  accept: string[];
  maxSizeMB?: number;
  maxFiles?: number;
  multiple?: boolean;
}

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/** Generate a stable id for a client-side file entry. */
export { createId };

function toFileWithMeta(file: File): FileWithMeta {
  return {
    id: createId(),
    file,
    name: sanitizeFilename(file.name),
    size: file.size,
    type: file.type,
  };
}

export interface PdfToolApi {
  files: FileWithMeta[];
  status: PdfToolStatus;
  message: string;
  result: PdfToolResult | null;
  error: string | null;
  canAddMore: boolean;
  addFiles: (list: File[]) => void;
  /** Add file entries that already carry ids (e.g. to key preview URLs by id). */
  addFileMetas: (list: FileWithMeta[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  reorderFiles: (ids: string[]) => void;
  setPageCount: (id: string, pageCount: number) => void;
  run: (runner: (ctx: RunContext) => Promise<PdfToolResult>) => Promise<void>;
  setMessage: (message: string) => void;
  reset: () => void;
}

export function usePdfTool(options: UsePdfToolOptions): PdfToolApi {
  const { accept, multiple = true } = options;
  const maxSizeMB = options.maxSizeMB ?? 200;
  const maxFiles = options.maxFiles ?? 20;
  const maxBytes = maxSizeMB * 1024 * 1024;

  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [status, setStatus] = useState<PdfToolStatus>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<PdfToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Shared validation + append used by addFiles and addFileMetas.
  const appendMeta = useCallback(
    (incoming: FileWithMeta[]) => {
      const accepted: FileWithMeta[] = [];
      let error: string | null = null;

      for (const meta of incoming) {
        try {
          assertFileType(meta.file, accept);
          assertFileSize(meta.file, maxBytes);
          accepted.push(meta);
        } catch (err) {
          error ??= toErrorMessage(err);
        }
      }

      setFiles((previous) => {
        if (!multiple && accepted.length > 0) {
          return [accepted[0]];
        }
        const remaining = multiple
          ? maxFiles - previous.length
          : 1 - previous.length;
        if (remaining <= 0) {
          error ??= multiple
            ? `You can add up to ${maxFiles} files at a time. Remove a file first to add another.`
            : "This tool handles one file at a time. Remove the current file before adding another.";
          return previous;
        }
        const merged = [...previous, ...accepted].slice(0, maxFiles);
        return merged;
      });

      setResult(null);
      setMessage("");
      setStatus((s) =>
        s === "completed" || s === "error"
          ? "ready"
          : accepted.length > 0
            ? "ready"
            : s,
      );
      setError(error);
    },
    [accept, maxBytes, maxFiles, multiple],
  );

  const addFiles = useCallback(
    (list: File[]) => {
      const incoming = Array.from(list ?? []).map(toFileWithMeta);
      if (incoming.length === 0) return;
      appendMeta(incoming);
    },
    [appendMeta],
  );

  const addFileMetas = useCallback(
    (list: FileWithMeta[]) => {
      const metas = Array.from(list ?? []).filter((meta) => meta && meta.file);
      if (metas.length === 0) return;
      appendMeta(metas);
    },
    [appendMeta],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((previous) => previous.filter((file) => file.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const reorderFiles = useCallback((ids: string[]) => {
    setFiles((previous) => {
      const byId = new Map(previous.map((file) => [file.id, file]));
      const next: FileWithMeta[] = [];
      for (const id of ids) {
        const file = byId.get(id);
        if (file) {
          next.push(file);
          byId.delete(id);
        }
      }
      for (const file of byId.values()) next.push(file);
      return next;
    });
  }, []);

  const setPageCount = useCallback((id: string, pageCount: number) => {
    setFiles((previous) =>
      previous.map((file) =>
        file.id === id ? { ...file, pageCount } : file,
      ),
    );
  }, []);

  const run = useCallback(
    async (runner: (ctx: RunContext) => Promise<PdfToolResult>) => {
      if (files.length === 0) return;
      setStatus("processing");
      setMessage("Preparing");
      setError(null);
      setResult(null);

      const ctx: RunContext = {
        files,
        setMessage: (next) => {
          if (mountedRef.current) setMessage(next);
        },
      };

      try {
        const nextResult = await runner(ctx);
        if (!mountedRef.current) return;
        setResult(nextResult);
        setMessage("Done");
        setStatus("completed");
      } catch (err) {
        if (!mountedRef.current) return;
        setError(toErrorMessage(err));
        setMessage("");
        setStatus("error");
      }
    },
    [files],
  );

  const setMessagePublic = useCallback((next: string) => {
    if (mountedRef.current) setMessage(next);
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setMessage("");
    setStatus("idle");
  }, []);

  return {
    files,
    status,
    message,
    result,
    error,
    canAddMore: multiple ? files.length < maxFiles : files.length === 0,
    addFiles,
    addFileMetas,
    removeFile,
    clearFiles,
    reorderFiles,
    setPageCount,
    run,
    setMessage: setMessagePublic,
    reset,
  };
}