import { loadPdfDocument, createPdfDocument } from "@/lib/pdf/document";

/** Extract the given 0-based page indices into a brand-new PDF. */
export async function extractPages(
  srcBytes: ArrayBuffer,
  indices: number[],
  displayName = "file",
): Promise<Uint8Array> {
  const src = await loadPdfDocument(srcBytes, displayName);
  const out = await createPdfDocument();
  const pages = await out.copyPages(src, indices);
  for (const page of pages) {
    out.addPage(page);
  }
  return out.save({ useObjectStreams: true });
}