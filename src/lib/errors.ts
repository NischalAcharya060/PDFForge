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
    `"${displayName}" isn't a file type this tool can open. Check the accepted formats shown in the upload area and try again.`,
  );

export const FileTooLarge = (maxMB: number): PdfToolError =>
  new PdfToolError(
    "FileTooLarge",
    `This file is too large to process. The maximum supported size is ${maxMB} MB — try a smaller file, or compress it first and then retry.`,
  );

export const InvalidPDF = (displayName = "file"): PdfToolError =>
  new PdfToolError(
    "InvalidPDF",
    `We couldn't open "${displayName}" because it doesn't appear to be a valid PDF. It may be damaged or saved with the wrong extension — please try another file.`,
  );

export const PasswordProtectedPDF = (displayName = "file"): PdfToolError =>
  new PdfToolError(
    "PasswordProtectedPDF",
    `"${displayName}" is locked with a password, so we can't read it. Unlock it with the correct password first, then try again.`,
  );

export const TooManyPages = (max: number): PdfToolError =>
  new PdfToolError(
    "TooManyPages",
    `This document has more pages than can be processed in a single pass. Split it into smaller parts of up to ${max} pages each, then process them one at a time.`,
  );

export const BrowserProcessingUnavailable = (): PdfToolError =>
  new PdfToolError(
    "BrowserProcessingUnavailable",
    "This tool runs entirely in your browser, but your current browser doesn't support the features it needs. Please update to the latest Chrome, Firefox, Safari, or Edge and try again.",
  );

export const ProcessingFailed = (detail?: string): PdfToolError =>
  new PdfToolError(
    "ProcessingFailed",
    detail
      ? `We couldn't finish processing your file: ${detail}`
      : "We couldn't finish processing your file. Please try again — if the problem continues, the document may be damaged or unusually complex.",
  );

export function toErrorMessage(error: unknown): string {
  if (error instanceof PdfToolError) return error.message;
  if (error instanceof Error) {
    const message = error.message;
    if (message.includes("is encrypted")) return "This PDF is password protected. Unlock it first, then try again.";
    if (message.includes("PasswordException")) return "This PDF is password protected. Unlock it first, then try again.";
    if (message.includes("InvalidPDFException")) return "This file doesn't appear to be a valid PDF. It may be damaged — please try another file.";
    if (/failed to parse|corrupt|malformed/i.test(message)) {
      return "This PDF looks damaged or unsupported, so we couldn't read it. Please try a different file.";
    }
    return "Something unexpected went wrong while processing your file. Your file never left your device — please try again, or choose a different file.";
  }
  return "Something unexpected went wrong while processing your file. Your file never left your device — please try again, or choose a different file.";
}