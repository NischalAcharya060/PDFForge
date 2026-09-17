import { loadPdfDocument, createPdfDocument } from "@/lib/pdf/document";

/** Reorder a PDF's pages. `newOrder` is an array of 0-based page indices. */
export async function reorderPdf(
  srcBytes: ArrayBuffer,
  newOrder: number[],
  displayName = "file",
): Promise<Uint8Array> {
  const src = await loadPdfDocument(srcBytes, displayName);
  const out = await createPdfDocument();
  const pages = await out.copyPages(src, newOrder);
  for (const page of pages) {
    out.addPage(page);
  }
  return out.save({ useObjectStreams: true });
}