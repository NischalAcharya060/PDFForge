export class PdfToolError extends Error {
  constructor(
    public readonly code: PdfErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PdfToolError";
  }
}

export type PdfErrorCode =
  | "UnsupportedFileType"
  | "FileTooLarge"
  | "InvalidPDF"
  | "PasswordProtectedPDF"
  | "TooManyPages"
  | "ProcessingFailed"
  | "BrowserProcessingUnavailable";

export const UnsupportedFileType = (
  displayName = "file",
): PdfToolError =>
  new PdfToolError(
    "UnsupportedFileType",
    `${displayName} is not a supported file type for this tool.`,
  );

export const FileTooLarge = (maxMB: number): PdfToolError =>
  new PdfToolError(
    "FileTooLarge",
    `File is too large. The maximum supported size is ${maxMB} MB.`,
  );

export const InvalidPDF = (displayName = "file"): PdfToolError =>
  new PdfToolError(
    "InvalidPDF",
    `${displayName} does not look like a valid PDF. Please check the file and try again.`,
  );

export const PasswordProtectedPDF = (displayName = "file"): PdfToolError =>
  new PdfToolError(
    "PasswordProtectedPDF",
    `${displayName} is password protected and cannot be read. Unlock it first and try again.`,
  );

export const TooManyPages = (max: number): PdfToolError =>
  new PdfToolError(
    "TooManyPages",
    `This document has too many pages to process in your browser. Please split it into smaller files first (up to ${max} pages).`,
  );

export const BrowserProcessingUnavailable = (): PdfToolError =>
  new PdfToolError(
    "BrowserProcessingUnavailable",
    "This tool requires a modern browser with support for client-side processing. Please try a recent version of Chrome, Firefox, Safari, or Edge.",
  );

export const ProcessingFailed = (detail?: string): PdfToolError =>
  new PdfToolError(
    "ProcessingFailed",
    detail ? `Processing failed: ${detail}` : "Processing failed. Please try again.",
  );

export function toErrorMessage(error: unknown): string {
  if (error instanceof PdfToolError) return error.message;
  if (error instanceof Error) {
    const message = error.message;
    if (message.includes("is encrypted")) return "This PDF is password protected and cannot be read.";
    if (message.includes("PasswordException")) return "This PDF is password protected and cannot be read.";
    if (message.includes("InvalidPDFException")) return "This does not look like a valid PDF.";
    if (/failed to parse|corrupt|malformed/i.test(message)) {
      return "This PDF appears to be corrupt or unsupported. Please try another file.";
    }
    return "Something went wrong while processing your file. Please try again.";
  }
  return "Something went wrong while processing your file. Please try again.";
}