import { loadPdfDocument, createPdfDocument } from "@/lib/pdf/document";

/** Merge multiple PDF files (in order) into a single PDF. */
export async function mergePdfs(
  sources: ArrayBuffer[],
  onProgress?: (message: string) => void,
): Promise<Uint8Array> {
  if (sources.length === 0) {
    throw new Error("No files to merge.");
  }

  const out = await createPdfDocument();

  for (let i = 0; i < sources.length; i++) {
    onProgress?.(`Merging file ${i + 1} of ${sources.length}…`);
    const src = await loadPdfDocument(sources[i], `file ${i + 1}`);
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const page of pages) {
      out.addPage(page);
    }
  }

  onProgress?.("Finalizing PDF…");
  return out.save({ useObjectStreams: true });
}