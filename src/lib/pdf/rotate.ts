import { degrees } from "pdf-lib";

import { loadPdfDocument } from "@/lib/pdf/document";

export type RotationDegrees = 90 | 180 | 270;

/** Rotate a PDF's pages by the given amount (in addition to any existing rotation). */
export async function rotatePdf(
  srcBytes: ArrayBuffer,
  targets: RotationMap,
  displayName = "file",
): Promise<Uint8Array> {
  const doc = await loadPdfDocument(srcBytes, displayName);
  const pages = doc.getPages();

  for (const [index, amount] of Object.entries(targets)) {
    const page = pages[Number(index)];
    if (!page) continue;
    const existing = page.getRotation().angle;
    // pdf-lib stores effective rotation angle; combine so relative adds apply.
    page.setRotation(degrees((existing + amount) % 360));
  }

  return doc.save({ useObjectStreams: true });
}

export type RotationMap = Record<number, RotationDegrees>;

export function rotationMapForAll(pageCount: number, amount: RotationDegrees): RotationMap {
  const map: RotationMap = {};
  for (let i = 0; i < pageCount; i++) map[i] = amount;
  return map;
}