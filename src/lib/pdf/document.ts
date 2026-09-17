import { PDFDocument, ParseSpeeds } from "pdf-lib";

import { InvalidPDF, PasswordProtectedPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export interface PdfInfo {
  pageCount: number;
  isEncrypted: boolean;
  title?: string;
  author?: string;
}

export async function loadPdfDocument(
  bytes: ArrayBuffer | Uint8Array,
  displayName = "file",
  tryUnencrypted = false,
): Promise<PDFDocument> {
  const data = bytesAsUint8Array(bytes);
  assertPdfBytes(data, displayName);
  try {
    return await PDFDocument.load(data, {
      ignoreEncryption: tryUnencrypted,
      parseSpeed: ParseSpeeds.Fastest,
      updateMetadata: false,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("encrypted")) {
      throw PasswordProtectedPDF(displayName);
    }
    throw InvalidPDF(displayName);
  }
}

export async function getPdfInfo(bytes: ArrayBuffer | Uint8Array, displayName = "file"): Promise<PdfInfo> {
  const doc = await loadPdfDocument(bytes, displayName);
  return {
    pageCount: doc.getPageCount(),
    isEncrypted: doc.isEncrypted,
    title: doc.getTitle(),
    author: doc.getAuthor(),
  };
}

export async function countPdfPages(bytes: ArrayBuffer | Uint8Array, displayName = "file"): Promise<number> {
  const doc = await loadPdfDocument(bytes, displayName);
  return doc.getPageCount();
}

export async function createPdfDocument(): Promise<PDFDocument> {
  return PDFDocument.create();
}