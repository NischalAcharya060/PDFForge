import { FileTooLarge, InvalidPDF, PdfToolError, UnsupportedFileType } from "@/lib/errors";

export const MAX_FILE_SIZE_MB = 200;
export const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function sanitizeFilename(name: string): string {
  const base = name.replace(/[\\/:*?"<>|]+/g, "_").trim().replace(/\s+/g, " ");
  return base || "untitled";
}

/** Strip the file extension from a filename. */
export function baseName(name: string): string {
  const sanitized = sanitizeFilename(name);
  const dot = sanitized.lastIndexOf(".");
  if (dot <= 0) return sanitized;
  return sanitized.slice(0, dot);
}

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return "";
  return name.slice(dot + 1).toLowerCase();
}

export function mimeTypeFor(file: File): string {
  return file.type || "application/pdf";
}

/** Check a file's magic bytes to confirm it is a real PDF (extension-independent). */
export function isPdfBytes(bytes: ArrayBuffer | Uint8Array): boolean {
  const view =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes.slice(0, 8));
  if (view.length < 4) return false;
  const head = view.subarray(0, 8);
  const ascii = String.fromCharCode(...head);
  if (ascii.startsWith("%PDF-")) return true;
  // Allow PDFs with leading garbage bytes but still containing %PDF- within the first 1024 bytes.
  const sample = new Uint8Array(bytes).subarray(0, 1024);
  const text = String.fromCharCode(...sample);
  return text.includes("%PDF-");
}

export function assertPdfBytes(
  bytes: ArrayBuffer | Uint8Array,
  displayName: string,
): void {
  if (!isPdfBytes(bytes)) throw InvalidPDF(displayName);
}

export function assertFileType(file: File, accept: string[]): void {
  const withImageAliases = accept.some((type) =>
    ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(type),
  );
  if (!withImageAliases) return;

  const extension = fileExtension(file.name);
  const mime = file.type;
  const ok =
    accept.includes(mime) ||
    (accept.includes("image/jpeg") &&
      (mime === "image/jpg" || ["jpg", "jpeg"].includes(extension))) ||
    (accept.includes("image/png") && extension === "png") ||
    (accept.includes("image/webp") && extension === "webp") ||
    (accept.includes("application/pdf") && extension === "pdf");

  if (!ok) throw UnsupportedFileType(file.name);
}

export function assertFileSize(file: File, maxBytes = MAX_BYTES): void {
  if (file.size > maxBytes) {
    throw FileTooLarge(Math.floor(maxBytes / (1024 * 1024)));
  }
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  try {
    return await file.arrayBuffer();
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && (error as Error).name === "AbortError") {
      throw new PdfToolError("ProcessingFailed", "Reading the file was interrupted. Please try again.");
    }
    throw error;
  }
}

export function bytesAsUint8Array(bytes: ArrayBuffer | Uint8Array): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}