import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { InvalidPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export type WatermarkColor = "gray" | "red" | "black" | "blue";

export interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number;
  color?: WatermarkColor;
}

const colorMap = {
  gray: rgb(0.5, 0.5, 0.5),
  red: rgb(0.9, 0.2, 0.2),
  black: rgb(0, 0, 0),
  blue: rgb(0.15, 0.4, 0.85),
};

export async function addWatermark(
  srcBytes: ArrayBuffer | Uint8Array,
  options: WatermarkOptions = {},
  displayName = "file",
  onProgress?: (message: string) => void,
): Promise<Uint8Array> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, displayName);

  const {
    text = "CONFIDENTIAL",
    fontSize = 52,
    opacity = 0.25,
    rotation = 45,
    color = "gray",
  } = options;

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(data, { ignoreEncryption: false });
  } catch {
    throw InvalidPDF(displayName);
  }

  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const selectedColor = colorMap[color] ?? colorMap.gray;
  const pages = doc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    onProgress?.(`Watermarking page ${i + 1} of ${total}...`);
    const page = pages[i];
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    // Approximate centering with rotation around the text center
    const rad = (rotation * Math.PI) / 180;
    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX - (textWidth / 2) * Math.cos(rad) + (textHeight / 2) * Math.sin(rad);
    const y = centerY - (textWidth / 2) * Math.sin(rad) - (textHeight / 2) * Math.cos(rad);

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: selectedColor,
      opacity,
      rotate: degrees(rotation),
    });
  }

  return doc.save();
}
