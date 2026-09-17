import { PDFDocument } from "pdf-lib";

import { BrowserProcessingUnavailable, TooManyPages } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export interface CompressImageOptions {
  /** JPEG quality passed to the canvas encoder. Default: 0.82. */
  jpegQuality?: number;
  /** Canvas render scale (1 unit = 72pt). Default: 1.5 (~108 DPI). */
  renderScale?: number;
  onProgress?: (message: string) => void;
}

const MAX_PAGES = 80;
const DEFAULT_RENDER_SCALE = 1.5;
const DEFAULT_JPEG_QUALITY = 0.82;

function isCanvasSupported(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined"
  );
}

/**
 * Render every page of a PDF to a JPEG and rebuild the document around those
 * images. Produces the smallest files but destroys the text layer — pages
 * become flat images. Callers must warn the user about that trade-off.
 */
export async function compressPdfToImages(
  srcBytes: ArrayBuffer | Uint8Array,
  options: CompressImageOptions = {},
): Promise<Uint8Array> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, "file");
  if (!isCanvasSupported()) throw BrowserProcessingUnavailable();

  const { openPdfForRendering, renderPageToCanvas, destroyPdfDocument } =
    await import("./pdfjs");

  const renderScale = options.renderScale ?? DEFAULT_RENDER_SCALE;
  const jpegQuality = options.jpegQuality ?? DEFAULT_JPEG_QUALITY;

  const source = await openPdfForRendering(data);
  const out = await PDFDocument.create();
  try {
    const pageCount = source.numPages;
    if (pageCount > MAX_PAGES) throw TooManyPages(MAX_PAGES);

    for (let i = 1; i <= pageCount; i++) {
      options.onProgress?.(`Rendering page ${i} of ${pageCount}…`);
      const page = await source.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement("canvas");
      await renderPageToCanvas({ canvas, page, scale: renderScale });

      const jpeg = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) =>
            result ? resolve(result) : reject(new Error("JPEG encoding failed")),
          "image/jpeg",
          jpegQuality,
        ),
      );

      const image = await out.embedJpg(new Uint8Array(await jpeg.arrayBuffer()));
      const outPage = out.addPage([viewport.width, viewport.height]);
      outPage.drawImage(image, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
    }
  } finally {
    await destroyPdfDocument(source);
  }

  options.onProgress?.("Finalizing PDF…");
  return out.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}