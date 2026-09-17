import { PDFDocument } from "pdf-lib";

import { BrowserProcessingUnavailable } from "@/lib/errors";
import { bytesToBlob } from "@/lib/download";

export interface ImageLike {
  bytes: ArrayBuffer | Uint8Array;
  type: string;
  name: string;
}

export type PdfPageSize = "a4" | "letter" | "auto";
export type PdfOrientation = "portrait" | "landscape" | "auto";

export interface ImagesToPdfOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  margin: number;
}

const A4_PORTRAIT: [number, number] = [595.28, 841.89];
const LETTER_PORTRAIT: [number, number] = [612, 792];

interface DecodedImage {
  pixels: Blob;
  width: number;
  height: number;
  isPng: boolean;
}

function isBrowserRasterSupported(): boolean {
  return (
    typeof createImageBitmap === "function" &&
    typeof document !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined"
  );
}

async function decodeRaster(
  bytes: Uint8Array,
  type: string,
): Promise<DecodedImage> {
  if (!isBrowserRasterSupported()) {
    throw BrowserProcessingUnavailable();
  }

  const bitmap = await createImageBitmap(bytesToBlob(bytes, type));
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const isPng = !type.includes("jpeg");
  const pixelType = isPng ? "image/png" : "image/jpeg";
  const quality = isPng ? undefined : 0.92;

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Encoding failed"))),
      pixelType,
      quality,
    ),
  );

  return { pixels: blob, width: canvas.width, height: canvas.height, isPng };
}

function pageSizePoints(pageSize: PdfPageSize, orientation: PdfOrientation): [number, number] {
  let size: [number, number];
  if (pageSize === "letter") size = LETTER_PORTRAIT;
  else if (pageSize === "a4") size = A4_PORTRAIT;
  else throw new Error("Unknown page size");

  const landscape =
    orientation === "landscape" || (orientation === "auto" && size[0] < size[1])
      ? true
      : orientation === "portrait"
        ? false
        : orientation === "auto"
          ? size[0] > size[1]
          : false;

  return size[0] < size[1] ? (landscape ? [size[1], size[0]] : size) : landscape ? size : [size[1], size[0]];
}

interface FitRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function fitContain(imageW: number, imageH: number, boxW: number, boxH: number): FitRect {
  const scale = Math.min(boxW / imageW, boxH / imageH);
  const width = imageW * scale;
  const height = imageH * scale;
  return {
    x: (boxW - width) / 2,
    y: (boxH - height) / 2,
    width,
    height,
  };
}

/** Convert a list of raster images into a single PDF. Runs in the browser. */
export async function imagesToPdf(
  images: ImageLike[],
  options: ImagesToPdfOptions,
  onProgress?: (message: string) => void,
): Promise<Uint8Array> {
  if (images.length === 0) throw new Error("No images to convert.");
  if (!isBrowserRasterSupported()) throw BrowserProcessingUnavailable();

  const doc = await PDFDocument.create();
  const decoded: DecodedImage[] = [];

  for (let i = 0; i < images.length; i++) {
      onProgress?.(`Reading image ${i + 1} of ${images.length}…`);
      const raw = images[i].bytes;
      const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
      decoded.push(await decodeRaster(bytes, images[i].type));
    }

    for (let i = 0; i < decoded.length; i++) {
      onProgress?.(`Adding image ${i + 1} of ${decoded.length}…`);
      const item = decoded[i];

      if (options.pageSize === "auto") {
        // Page sized to fit the image inside an A4 box without gutters.
        const box = A4_PORTRAIT;
        const rect = fitContain(item.width, item.height, box[0], box[1]);
        const page = doc.addPage([rect.width, rect.height]);
        const image = item.isPng
          ? await doc.embedPng(await item.pixels.arrayBuffer())
          : await doc.embedJpg(await item.pixels.arrayBuffer());
        page.drawImage(image, { x: 0, y: 0, width: rect.width, height: rect.height });
        continue;
      }

      const outer = pageSizePoints(options.pageSize, options.orientation);
      const margin = Math.max(0, options.margin);
      const boxW = Math.max(1, outer[0] - margin * 2);
      const boxH = Math.max(1, outer[1] - margin * 2);
      const rect = fitContain(item.width, item.height, boxW, boxH);
      const page = doc.addPage(outer);
      const image = item.isPng
        ? await doc.embedPng(await item.pixels.arrayBuffer())
        : await doc.embedJpg(await item.pixels.arrayBuffer());
      page.drawImage(image, {
        x: margin + rect.x,
        y: margin + rect.y,
        width: rect.width,
        height: rect.height,
      });
    }

  onProgress?.("Finalizing PDF…");
  return doc.save({ useObjectStreams: true });
}