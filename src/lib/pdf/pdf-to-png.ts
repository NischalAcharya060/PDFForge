import { TooManyPages } from "@/lib/errors";
import { openPdfForRendering, renderPageToCanvas, destroyPdfDocument } from "@/lib/pdf/pdfjs";
import type { PdfParts } from "@/lib/pdf/split";

export interface PdfToPngOptions {
  scale: number; // 1.0, 1.5, 2.0
  maxPages?: number;
}

/** Convert every page of a PDF to a high-resolution lossless PNG image. */
export async function pdfToPng(
  srcBytes: ArrayBuffer,
  options: PdfToPngOptions,
  onProgress?: (message: string) => void,
): Promise<PdfParts[]> {
  const doc = await openPdfForRendering(srcBytes);
  const total = doc.numPages;
  const maxPages = options.maxPages ?? 80;

  if (total > maxPages) {
    await destroyPdfDocument(doc);
    throw TooManyPages(maxPages);
  }

  const parts: PdfParts[] = [];
  const scale = Math.max(0.5, Math.min(3, options.scale || 1.5));

  try {
    for (let i = 1; i <= total; i++) {
      onProgress?.(`Rendering page ${i} of ${total}…`);
      const page = await doc.getPage(i);
      const canvas = document.createElement("canvas");
      await renderPageToCanvas({ canvas, page, scale });

      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (result) => (result ? resolve(result) : reject(new Error("PNG encoding failed"))),
          "image/png",
        ),
      );
      const bytes = new Uint8Array(await blob.arrayBuffer());
      parts.push({ bytes, name: `page_${i}.png` });
    }
  } finally {
    await destroyPdfDocument(doc);
  }

  return parts;
}
