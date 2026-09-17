import { PDFDocument, PDFName, ParseSpeeds } from "pdf-lib";

import { InvalidPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export type CompressionLevel = "light" | "balanced" | "strong";

export interface CompressOptions {
  /** Strip producer/creator metadata. Overrides the level default. */
  stripMetadata?: boolean;
  /** How aggressively the document structure is optimized. Default: "balanced". */
  level?: CompressionLevel;
  /**
   * Rasterize every page to a JPEG for the smallest possible result.
   * Pages become non-selectable images, so use sparingly.
   */
  maxCompression?: boolean;
  onProgress?: (message: string) => void;
}

export interface CompressResult {
  bytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  /** True when pages were rasterized to images (maxCompression path). */
  imageBased?: boolean;
}

/**
 * Honest client-side compression. The default path re-serializes the
 * document, dropping redundant metadata and using object streams; "strong"
 * additionally removes XMP data. When "maxCompression" is set the document
 * is rasterized page-by-page into embedded JPEGs (the page text becomes a
 * non-selectable image). If nothing produces a smaller file we return the
 * original bytes with a 0% save.
 */
export async function compressPdf(
  srcBytes: ArrayBuffer | Uint8Array,
  options: CompressOptions = {},
  displayName = "file",
): Promise<CompressResult> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, displayName);
  const originalSize = data.length;

  const level = options.level ?? "balanced";
  const stripMetadata = options.stripMetadata ?? level !== "light";

  const bytes = options.maxCompression
    ? await compressToImages(data, options.onProgress)
    : await compressStructure(data, displayName, { level, stripMetadata });

  const compressedSize = bytes.length;
  const savedPercent =
    compressedSize >= originalSize
      ? 0
      : Math.round(((originalSize - compressedSize) / originalSize) * 100);

  return {
    bytes: compressedSize < originalSize ? bytes : data,
    originalSize,
    compressedSize: compressedSize < originalSize ? compressedSize : originalSize,
    savedPercent,
    imageBased: options.maxCompression === true,
  };
}

async function compressStructure(
  data: Uint8Array,
  displayName: string,
  options: { level: CompressionLevel; stripMetadata: boolean },
): Promise<Uint8Array> {
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

  if (options.stripMetadata) {
    doc.setProducer("");
    doc.setCreator("");
  }
  if (options.level === "strong") {
    // Drop the XMP stream, which can carry a few KB of redundant markup.
    doc.catalog.delete(PDFName.of("Metadata"));
  }

  return doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}

async function compressToImages(
  data: Uint8Array,
  onProgress?: (message: string) => void,
): Promise<Uint8Array> {
  const { compressPdfToImages } = await import("./compress-image");
  return compressPdfToImages(data, { onProgress });
}