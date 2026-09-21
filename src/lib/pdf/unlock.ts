import { PDFDocument } from "pdf-lib-with-encrypt";

import { InvalidPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

/** Decrypt and remove password protection from an encrypted PDF. */
export async function unlockPdf(
  srcBytes: ArrayBuffer | Uint8Array,
  password: string,
  displayName = "file",
): Promise<Uint8Array> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, displayName);

  if (!password) {
    throw new Error("Enter the document password to continue.");
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(data, {
      password,
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("password") || msg.includes("encrypted") || msg.includes("decrypt")) {
        throw new Error("That password didn't work. Double-check it (passwords are case-sensitive) and try again.");
      }
    }
    throw InvalidPDF(displayName);
  }

  // Saving without calling doc.encrypt removes all encryption from the output.
  return doc.save({ useObjectStreams: true });
}
