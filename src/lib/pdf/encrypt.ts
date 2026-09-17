import { PDFDocument } from "pdf-lib-with-encrypt";

import { InvalidPDF } from "@/lib/errors";
import { assertPdfBytes, bytesAsUint8Array } from "@/lib/files";

export interface EncryptOptions {
  userPassword: string;
  ownerPassword?: string;
  /** Whether readers may print the document after unlocking it with the password. Default: true. */
  allowPrint?: boolean;
}

/** Password-protect a PDF with real RC4/AES encryption (in the browser). */
export async function encryptPdf(
  srcBytes: ArrayBuffer | Uint8Array,
  options: EncryptOptions,
  displayName = "file",
): Promise<Uint8Array> {
  const data = bytesAsUint8Array(srcBytes);
  assertPdfBytes(data, displayName);

  if (!options.userPassword) {
    throw new Error("A password is required to protect the file.");
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(data, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("encrypted")) {
      throw new Error(
        "This PDF is already password protected. Add editing permissions instead.",
      );
    }
    throw InvalidPDF(displayName);
  }

  const ownerPassword = options.ownerPassword ?? options.userPassword;
  doc.encrypt({
    userPassword: options.userPassword,
    ownerPassword,
    permissions: {
      printing: options.allowPrint === false ? false : "highResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });

  return doc.save({ useObjectStreams: false });
}