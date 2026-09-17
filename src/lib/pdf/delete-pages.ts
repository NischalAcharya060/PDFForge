import { loadPdfDocument } from "@/lib/pdf/document";

/** Remove pages from a PDF. `indicesToDelete` are 0-based page indices. */
export async function deletePages(
  srcBytes: ArrayBuffer,
  indicesToDelete: number[],
  displayName = "file",
): Promise<Uint8Array> {
  const doc = await loadPdfDocument(srcBytes, displayName);
  const toDelete = [...new Set(indicesToDelete)].sort((a, b) => b - a);
  for (const index of toDelete) {
    if (index >= 0 && index < doc.getPageCount()) {
      doc.removePage(index);
    }
  }
  return doc.save({ useObjectStreams: true });
}