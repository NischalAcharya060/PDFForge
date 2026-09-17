import { PDFDocument } from "pdf-lib";

import { loadPdfDocument, createPdfDocument } from "@/lib/pdf/document";

export interface PdfParts {
  bytes: Uint8Array;
  name: string;
}

/** Build a new PDF from a subset of pages of the source document. */
async function buildPdfFromIndices(
  src: PDFDocument,
  indices: number[],
): Promise<Uint8Array> {
  const out = await createPdfDocument();
  const pages = await out.copyPages(src, indices);
  for (const page of pages) {
    out.addPage(page);
  }
  return out.save({ useObjectStreams: true });
}

/** Split every page into its own PDF. */
export async function splitIntoPages(
  srcBytes: ArrayBuffer,
  displayName = "file",
  onProgress?: (message: string) => void,
): Promise<PdfParts[]> {
  const src = await loadPdfDocument(srcBytes, displayName);
  const total = src.getPageCount();
  const parts: PdfParts[] = [];

  for (let i = 0; i < total; i++) {
    onProgress?.(`Exporting page ${i + 1} of ${total}…`);
    const bytes = await buildPdfFromIndices(src, [i]);
    parts.push({ bytes, name: `page_${i + 1}.pdf` });
  }

  return parts;
}

/** Split a PDF into one PDF per requested group of pages. */
export async function splitIntoGroups(
  srcBytes: ArrayBuffer,
  groups: number[][],
  displayName = "file",
  onProgress?: (message: string) => void,
): Promise<PdfParts[]> {
  const src = await loadPdfDocument(srcBytes, displayName);
  const parts: PdfParts[] = [];

  for (let g = 0; g < groups.length; g++) {
    onProgress?.(`Creating part ${g + 1} of ${groups.length}…`);
    const bytes = await buildPdfFromIndices(src, groups[g]);
    const first = groups[g][0] + 1;
    const last = groups[g][groups[g].length - 1] + 1;
    const name =
      groups[g].length === 1 ? `page_${first}.pdf` : `pages_${first}-${last}.pdf`;
    parts.push({ bytes, name });
  }

  return parts;
}