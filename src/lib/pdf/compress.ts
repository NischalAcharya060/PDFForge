import { PDFDocument, ParseSpeeds } from "pdf-lib";

import { InvalidPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export interface CompressOptions {
  /** Strip producer/creator metadata during re-serialization. Default: true. */
  stripMetadata?: boolean;
}

export interface CompressResult {
  bytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
}

/**
 * Honest client-side compression: re-serialize the document, dropping
 * redundant metadata and using object streams. When this cannot produce a
 * smaller file we return the original bytes with a 0% save; the UI then
 * explains that the file could not be safely reduced in the browser.
 */
export async function compressPdf(
  srcBytes: ArrayBuffer | Uint8Array,
  options: CompressOptions = {},
  displayName = "file",
): Promise<CompressResult> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, displayName);

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(data, {
      ignoreEncryption: true,
      parseSpeed: ParseSpeeds.Fastest,
      updateMetadata: false,
    });
  } catch {
    throw InvalidPDF(displayName);
  }

  // Strip metadata that contributes to size without any value to the content.
    if (options.stripMetadata !== false) {
      doc.setProducer("");
      doc.setCreator("");
    }
    const bytes = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    // A compressed file should never be larger than the input.
    const compressedSize = bytes.length;
    const originalSize = data.length;
    const savedPercent =
      compressedSize >= originalSize
        ? 0
        : Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return {
      bytes: compressedSize < originalSize ? bytes : data,
      originalSize,
      compressedSize: compressedSize < originalSize ? compressedSize : originalSize,
      savedPercent,
    };
}