import { openPdfForRendering, destroyPdfDocument } from "@/lib/pdf/pdfjs";

export interface ExtractTextResult {
  text: string;
  pageCount: number;
}

/** Extract all readable text from a PDF document. */
export async function extractPdfText(
  srcBytes: ArrayBuffer | Uint8Array,
  onProgress?: (message: string) => void,
): Promise<ExtractTextResult> {
  const data = srcBytes instanceof Uint8Array ? srcBytes : new Uint8Array(srcBytes);
  const doc = await openPdfForRendering(data);
  const total = doc.numPages;
  const pageTexts: string[] = [];

  try {
    for (let i = 1; i <= total; i++) {
      onProgress?.(`Extracting text from page ${i} of ${total}…`);
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();

      const lines: string[] = [];
      let currentLine = "";
      let lastY: number | null = null;

      for (const item of textContent.items) {
        if (!("str" in item)) continue;
        const textItem = item as { str: string; transform: number[] };
        const itemY = textItem.transform[5];

        if (lastY !== null && Math.abs(itemY - lastY) > 5) {
          if (currentLine.trim()) lines.push(currentLine.trim());
          currentLine = textItem.str;
        } else {
          currentLine += (currentLine ? " " : "") + textItem.str;
        }
        lastY = itemY;
      }

      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }

      const pageBody = lines.join("\n");
      pageTexts.push(`--- Page ${i} ---\n${pageBody || "[No text found on this page]"}`);
    }
  } finally {
    await destroyPdfDocument(doc);
  }

  return {
    text: pageTexts.join("\n\n"),
    pageCount: total,
  };
}
