import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { InvalidPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left";

export type PageNumberFormat = "page-of-total" | "n-slash-total" | "n-only";

export interface PageNumberOptions {
  position?: PageNumberPosition;
  format?: PageNumberFormat;
  startNumber?: number;
  fontSize?: number;
  margin?: number;
}

export async function addPageNumbers(
  srcBytes: ArrayBuffer | Uint8Array,
  options: PageNumberOptions = {},
  displayName = "file",
  onProgress?: (message: string) => void,
): Promise<Uint8Array> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, displayName);

  const {
    position = "bottom-center",
    format = "page-of-total",
    startNumber = 1,
    fontSize = 10,
    margin = 32,
  } = options;

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(data, { ignoreEncryption: false });
  } catch {
    throw InvalidPDF(displayName);
  }

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    onProgress?.(`Numbering page ${i + 1} of ${total}...`);
    const page = pages[i];
    const pageNum = i + startNumber;

    let text = `${pageNum}`;
    if (format === "page-of-total") {
      text = `Page ${pageNum} of ${total}`;
    } else if (format === "n-slash-total") {
      text = `${pageNum} / ${total}`;
    }

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const { width, height } = page.getSize();

    let x = (width - textWidth) / 2;
    let y = margin;

    switch (position) {
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "bottom-center":
        x = (width - textWidth) / 2;
        y = margin;
        break;
      case "bottom-right":
        x = width - margin - textWidth;
        y = margin;
        break;
      case "top-left":
        x = margin;
        y = height - margin - fontSize;
        break;
      case "top-center":
        x = (width - textWidth) / 2;
        y = height - margin - fontSize;
        break;
      case "top-right":
        x = width - margin - textWidth;
        y = height - margin - fontSize;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.25, 0.25, 0.25),
    });
  }

  return doc.save();
}
