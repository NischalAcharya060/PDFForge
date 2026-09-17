import JSZip from "jszip";

/** Wrap arbitrary byte arrays (possibly backed by a SharedArrayBuffer) in a Blob. */
export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type });
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function createZipBlob(
  files: { name: string; blob: Blob }[],
  onProgress?: (message: string) => void,
): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  onProgress?.("Creating ZIP archive…");
  return zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (metadata) => {
      if (metadata.percent % 25 === 0) {
        onProgress?.(`Creating ZIP archive… ${Math.round(metadata.percent)}%`);
      }
    },
  );
}

export async function downloadZip(
  files: { name: string; blob: Blob }[],
  zipName: string,
  onProgress?: (message: string) => void,
): Promise<void> {
  const blob = await createZipBlob(files, onProgress);
  triggerDownload(blob, zipName);
}