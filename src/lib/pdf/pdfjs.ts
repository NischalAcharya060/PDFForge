import {
  InvalidPDF,
  PasswordProtectedPDF,
  BrowserProcessingUnavailable,
} from "@/lib/errors";

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

async function loadPdfJs(): Promise<typeof import("pdfjs-dist")> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      if (typeof window === "undefined") {
        throw BrowserProcessingUnavailable();
      }
      const pdfjs = await import("pdfjs-dist");
      const workerUrl = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
    pdfjsPromise.catch(() => {
      pdfjsPromise = null;
    });
  }
  return pdfjsPromise;
}

export interface RenderTaskInput {
  canvas: HTMLCanvasElement;
  page: import("pdfjs-dist").PDFPageProxy;
  scale: number;
}

/** Render a pdf.js page into the given canvas. */
export async function renderPageToCanvas({
  canvas,
  page,
  scale,
}: RenderTaskInput): Promise<void> {
  const viewport = page.getViewport({ scale });
  canvas.width = Math.max(1, Math.ceil(viewport.width));
  canvas.height = Math.max(1, Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser couldn't render a page preview. Please update your browser and try again.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // pdf.js v6 expects the canvas itself (canvasContext is gone).
  const renderTask = page.render({ canvas, viewport });
  await renderTask.promise;
}

/** Minimal surface of a pdf.js document that our rendering helpers use. */
export interface RenderablePdf {
  numPages: number;
  getPage(pageNumber: number): Promise<import("pdfjs-dist").PDFPageProxy>;
  destroy(): Promise<void>;
}

/**
 * Load a PDF document for rendering. Rejects for password-protected or
 * invalid files. The returned object owns the underlying loading task so
 * memory can be released with destroy().
 */
export async function openPdfForRendering(
  bytes: ArrayBuffer | Uint8Array,
): Promise<RenderablePdf> {
  const pdfjs = await loadPdfJs();
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let doc: import("pdfjs-dist").PDFDocumentProxy;
  let task: import("pdfjs-dist").PDFDocumentLoadingTask;
  try {
    task = pdfjs.getDocument({ data });
    doc = await task.promise;
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException") {
      throw PasswordProtectedPDF("file");
    }
    throw InvalidPDF("file");
  }

  let destroyed = false;
  return {
    get numPages() {
      return doc.numPages;
    },
    getPage: (pageNumber) => doc.getPage(pageNumber),
    destroy: async () => {
      if (destroyed) return;
      destroyed = true;
      try {
        await task.destroy();
      } catch {
        // best-effort cleanup
      }
    },
  };
}

/** Dispose of a renderable PDF to free memory. */
export async function destroyPdfDocument(
  doc: RenderablePdf | null | undefined,
): Promise<void> {
  if (!doc) return;
  try {
    await doc.destroy();
  } catch {
    // best-effort cleanup
  }
}