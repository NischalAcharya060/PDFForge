import { TooManyPages } from "@/lib/errors";
import { openPdfForRendering, renderPageToCanvas, destroyPdfDocument } from "@/lib/pdf/pdfjs";
import type { PdfParts } from "@/lib/pdf/split";

export interface PdfToImagesOptions {
  quality: number; // 0.3 – 1.0
  maxPages?: number;
}

function scaleForQuality(quality: number): number {
  // Higher quality → larger raster output.
  return 1 + quality;
}

/** Convert every page of a PDF to a JPG image (in the browser). */
export async function pdfToImages(
  srcBytes: ArrayBuffer,
  options: PdfToImagesOptions,
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
  const scale = scaleForQuality(options.quality);

  try {
    for (let i = 1; i <= total; i++) {
      onProgress?.(`Rendering page ${i} of ${total}…`);
      const page = await doc.getPage(i);
      const canvas = document.createElement("canvas");
      await renderPageToCanvas({ canvas, page, scale });

      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (result) => (result ? resolve(result) : reject(new Error("Encoding failed"))),
          "image/jpeg",
          options.quality,
        ),
      );
      // toBlob may produce a canvas that gets reused; clone to a stable array.
      const bytes = new Uint8Array(await blob.arrayBuffer());
      parts.push({ bytes, name: `page_${i}.jpg` });
    }
  } finally {
    await destroyPdfDocument(doc);
  }

  return parts;
}