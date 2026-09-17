import { StandardFonts, rgb } from "pdf-lib";

import { loadPdfDocument } from "@/lib/pdf/document";

export interface SignaturePlacement {
  pageIndex: number;
  /** Normalized X position (0 = left, 100 = right) */
  xPercent: number;
  /** Normalized Y position from top (0 = top, 100 = bottom) */
  yPercent: number;
  /** Width as a percentage of page width (e.g. 25 = 25% of page width) */
  widthPercent: number;
  /** Whether to stamp a date below the signature */
  includeDate?: boolean;
  /** Date text string to display */
  dateText?: string;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("Invalid signature image format.");
  }
  const base64 = dataUrl.slice(commaIndex + 1);
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/** Embed a signature image and optional date onto a PDF document. */
export async function signPdf(
  srcBytes: ArrayBuffer | Uint8Array,
  signatureDataUrl: string,
  placement: SignaturePlacement,
  displayName = "file",
): Promise<Uint8Array> {
  const doc = await loadPdfDocument(srcBytes, displayName);
  const pageCount = doc.getPageCount();

  const targetPageIndex = Math.max(0, Math.min(pageCount - 1, placement.pageIndex));
  const page = doc.getPage(targetPageIndex);
  const { width: pageWidth, height: pageHeight } = page.getSize();

  const signatureBytes = dataUrlToBytes(signatureDataUrl);
  const sigImage = await doc.embedPng(signatureBytes);

  const sigDims = sigImage.scale(1);
  const aspectRatio = sigDims.width / Math.max(1, sigDims.height);

  const widthPct = Math.min(90, Math.max(10, placement.widthPercent || 25));
  const sigWidth = (widthPct / 100) * pageWidth;
  const sigHeight = sigWidth / aspectRatio;

  // In PDF coordinates, (0, 0) is at the bottom-left corner.
  // xPercent: 0 = left edge, 100 = right edge minus signature width
  const maxPdfX = Math.max(0, pageWidth - sigWidth);
  const pdfX = (placement.xPercent / 100) * maxPdfX;

  // yPercent: 0 = top edge minus signature height, 100 = bottom edge
  const maxPdfY = Math.max(0, pageHeight - sigHeight);
  const pdfY = (1 - placement.yPercent / 100) * maxPdfY;

  page.drawImage(sigImage, {
    x: pdfX,
    y: pdfY,
    width: sigWidth,
    height: sigHeight,
  });

  if (placement.includeDate && placement.dateText) {
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontSize = Math.max(8, Math.min(14, sigHeight * 0.18));
    const textY = Math.max(5, pdfY - fontSize - 4);
    page.drawText(placement.dateText, {
      x: pdfX,
      y: textY,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return doc.save({ useObjectStreams: true });
}
