export interface ToolSeoFaq {
  question: string;
  answer: string;
}

export interface ToolSeoStep {
  title: string;
  description: string;
}

export interface ToolSeoContent {
  definition: string;
  features: string[];
  howTo: ToolSeoStep[];
  faqs: ToolSeoFaq[];
  relatedSlugs: string[];
}

export const toolSeoContent: Record<string, ToolSeoContent> = {
  "merge-pdf": {
    definition:
      "Merging PDF means combining multiple PDF files into one single document. PDFForge lets you merge PDFs online for free by dragging your files into the browser, reordering them, and clicking combine — all without uploading anything.",
    features: [
      "Combine an unlimited number of PDF files into one document",
      "Drag and drop to reorder pages before merging",
      "No file size limit beyond your device memory",
      "Instant local processing — no queue or upload",
    ],
    howTo: [
      {
        title: "Upload your PDFs",
        description:
          "Drag and drop or browse to select the PDF files you want to combine. You can add as many files as you need.",
      },
      {
        title: "Reorder files",
        description:
          "Drag items to arrange the order in which the PDFs will be merged into a single document.",
      },
      {
        title: "Merge and download",
        description:
          "Click the combine button. PDFForge builds the merged PDF locally in your browser and downloads it instantly.",
      },
    ],
    faqs: [
      {
        question: "Is merging PDF files online free?",
        answer:
          "Yes, PDFForge is 100% free. There are no limits, fees, or demands for an account — unlike cloud PDF merge services that restrict file counts on free plans.",
      },
      {
        question: "Are my PDFs safe when I merge them online?",
        answer:
          "Yes. PDFForge processes files entirely in your browser using WebAssembly. Your documents are never uploaded to a server, so nothing is stored or transmitted.",
      },
      {
        question: "Can I merge PDFs and images together?",
        answer:
          "PDFForge combines multiple PDF files. To merge images with PDFs, first convert your images to PDF with the JPG to PDF or PNG to PDF tool, then merge the resulting files.",
      },
    ],
    relatedSlugs: ["split-pdf", "compress-pdf", "extract-pdf-pages", "reorder-pdf-pages"],
  },
  "split-pdf": {
    definition:
      "Splitting a PDF means dividing one PDF document into multiple smaller files. PDFForge lets you split PDFs online for free into single pages or custom ranges, and download all pages as a ZIP — all in your browser.",
    features: [
      "Split into individual single pages",
      "Split by custom ranges like 1-3, 5, 8-10",
      "Download all pages at once as a ZIP file",
      "No uploads — the document never leaves your device",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Drag and drop a PDF file, or browse from your device. A few clicks is all it takes.",
      },
      {
        title: "Choose a split mode",
        description:
          "Pick 'split into pages' for one file per page, or enter custom ranges like 1-3, 5 to split into groups.",
      },
      {
        title: "Download the ZIP",
        description:
          "PDFForge extracts each part locally and packages them into a ZIP you download instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I split a PDF into separate pages?",
        answer:
          "Upload your PDF in the Split PDF tool, choose the default single-page mode, then download the ZIP containing one PDF per page. It is processed instantly in your browser.",
      },
      {
        question: "Can I split a PDF into even and odd pages?",
        answer:
          "PDFForge supports custom ranges, so you can enter a pattern such as 1,3,5,7 to extract odd pages into one group and 2,4,6,8 for even pages.",
      },
    ],
    relatedSlugs: ["merge-pdf", "extract-pdf-pages", "delete-pdf-pages", "reorder-pdf-pages"],
  },
  "compress-pdf": {
    definition:
      "Compressing a PDF reduces its file size so it is easier to email, upload, or share. PDFForge compresses PDFs online for free in your browser and shows exactly how much space you saved before you download.",
    features: [
      "Reduce large PDFs to a smaller size",
      "See the exact percentage saved before downloading",
      "Choose compression level to balance size and quality",
      "No uploads — compression happens on your device",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Drag and drop a PDF file into the dropzone or browse from your computer.",
      },
      {
        title: "Choose a compression level",
        description:
          "Pick a preset such as low, medium, or high compression depending on how much file size you need to save.",
      },
      {
        title: "Download the compressed PDF",
        description:
          "Review the new file size, then download your optimized PDF directly to your device.",
      },
    ],
    faqs: [
      {
        question: "How much can I compress a PDF?",
        answer:
          "Compression depends on the content. Mixed text and image PDFs typically shrink by 40–80%. PDFForge shows the exact new size and savings before you download.",
      },
      {
        question: "Does compressing a PDF hurt quality?",
        answer:
          "PDFForge lets you choose the compression level. Higher compression produces a smaller file with some visual tradeoffs in images; lower compression keeps more fidelity.",
      },
    ],
    relatedSlugs: ["merge-pdf", "pdf-to-jpg", "rotate-pdf", "watermark-pdf"],
  },
  "rotate-pdf": {
    definition:
      "Rotating a PDF changes the orientation of its pages by 90 or 180 degrees. PDFForge lets you rotate PDF pages online for free — all pages at once or specific pages only — entirely in your browser.",
    features: [
      "Rotate clockwise or counter-clockwise by 90 degrees",
      "Rotate pages upside down by 180 degrees",
      "Apply to all pages or only selected pages",
      "100% local processing with no file upload",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the PDF file whose pages you want to rotate.",
      },
      {
        title: "Select rotation",
        description:
          "Rotate every page at once, or click individual pages and turn them 90 or 180 degrees.",
      },
      {
        title: "Download the result",
        description:
          "Your corrected PDF is generated locally and downloaded in one click.",
      },
    ],
    faqs: [
      {
        question: "Can I rotate just one page in a PDF?",
        answer:
          "Yes. PDFForge lets you rotate all pages together or target individual pages, rotating each one clockwise, counter-clockwise, or 180 degrees.",
      },
      {
        question: "Is there a way to auto-rotate a scanned PDF?",
        answer:
          "PDFForge does not auto-detect orientation. Use the manual rotate tool to fix individual pages, then save the corrected document locally.",
      },
    ],
    relatedSlugs: ["reorder-pdf-pages", "delete-pdf-pages", "compress-pdf", "merge-pdf"],
  },
  "jpg-to-pdf": {
    definition:
      "JPG to PDF conversion turns one or more JPEG images into a single PDF document. PDFForge converts JPG to PDF online for free, letting you set page size, orientation, margins, and image fit from your browser.",
    features: [
      "Convert one or multiple JPG images into a single PDF",
      "Also accepts PNG and WebP images",
      "Customize page size, orientation, margin, and image fit",
      "Reorder images before converting",
    ],
    howTo: [
      {
        title: "Add your images",
        description:
          "Upload JPG, PNG, or WebP images. They can be dropped in any order and rearranged afterwards.",
      },
      {
        title: "Configure the layout",
        description:
          "Pick page size, orientation, margins, zoom, and how each image should fit on the page.",
      },
      {
        title: "Create the PDF",
        description:
          "PDFForge renders your images into a PDF locally and downloads it instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I turn a JPG into a PDF?",
        answer:
          "Open the JPG to PDF tool, drag in your images, choose your layout settings, and click create. The PDF is generated in your browser and downloaded immediately.",
      },
      {
        question: "Can I combine multiple JPGs into one PDF?",
        answer:
          "Yes. Add all the images you want to include, reorder them, and PDFForge merges them into a single multi-page PDF document.",
      },
    ],
    relatedSlugs: ["png-to-pdf", "webp-to-pdf", "pdf-to-jpg", "merge-pdf"],
  },
  "pdf-to-jpg": {
    definition:
      "PDF to JPG conversion turns each page of a PDF into a JPEG image. PDFForge converts PDF to JPG online for free with adjustable quality, and downloads every page as a ZIP — all locally in your browser.",
    features: [
      "Convert every PDF page into a JPG image",
      "Adjust image quality and resolution",
      "Download all pages in one ZIP file",
      "No uploads — conversion runs fully on your device",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Drop a PDF into the tool. Each page will be converted into a separate JPG.",
      },
      {
        title: "Set quality",
        description:
          "Choose a quality level and output resolution to balance image clarity with file size.",
      },
      {
        title: "Download your images",
        description:
          "Download individual JPGs or grab the full ZIP with every page at once.",
      },
    ],
    faqs: [
      {
        question: "How do I extract images from a PDF?",
        answer:
          "Use the PDF to JPG tool. Every page is rendered as a high-quality JPG. Page-bound images become part of the rendered page exactly as they appear.",
      },
      {
        question: "Can I choose the quality of the JPG output?",
        answer:
          "Yes. PDFForge lets you adjust quality and resolution so you can keep small file sizes or produce print-ready high-resolution images.",
      },
    ],
    relatedSlugs: ["pdf-to-png", "pdf-to-text", "jpg-to-pdf", "compress-pdf"],
  },
  "delete-pdf-pages": {
    definition:
      "Deleting PDF pages removes unwanted pages from a document. PDFForge lets you delete PDF pages online for free with a visual page selector, then downloads the cleaned document instantly from your browser.",
    features: [
      "Visually preview pages before deleting",
      "Remove one page or many at once",
      "Undo mistakes easily before saving",
      "Runs entirely on your device — no uploads",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Open a PDF and browse through a visual preview of every page.",
      },
      {
        title: "Select pages to remove",
        description:
          "Mark the pages you want to delete. You can also use ranges like 1-4 to remove a block.",
      },
      {
        title: "Download the revised PDF",
        description:
          "PDFForge rebuilds the document without the removed pages and downloads it instantly.",
      },
    ],
    faqs: [
      {
        question: "Can I delete multiple pages from a PDF at once?",
        answer:
          "Yes. Select several pages in the visual preview, or use a range such as 2-5, and all of them are removed in a single step.",
      },
      {
        question: "Can I undo a page deletion?",
        answer:
          "Before you download, PDFForge shows you exactly which pages remain. If you change your mind, deselect the pages or reset the selection.",
      },
    ],
    relatedSlugs: ["extract-pdf-pages", "reorder-pdf-pages", "split-pdf", "compress-pdf"],
  },
  "extract-pdf-pages": {
    definition:
      "Extracting PDF pages means pulling selected pages out of a document into a brand-new PDF. PDFForge lets you extract PDF pages online for free, selecting pages visually or with ranges like 1-3, 5, 8-10.",
    features: [
      "Create a new PDF from selected pages",
      "Select pages visually or by range",
      "Keep only what you need from a large document",
      "Processed locally — nothing is uploaded",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the PDF that contains the pages you want to keep.",
      },
      {
        title: "Pick the pages",
        description:
          "Click pages in the preview, or type ranges like 1-3, 5, 8-10 to select exactly what you need.",
      },
      {
        title: "Extract and download",
        description:
          "PDFForge builds a new PDF from the selected pages and downloads it to your device.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between extracting and deleting PDF pages?",
        answer:
          "Extract creates a new PDF from the pages you keep and discards the rest, while Delete removes unwanted pages from the original document. Both are available in PDFForge.",
      },
      {
        question: "Can I extract odd or even pages to split a PDF?",
        answer:
          "Yes. Enter ranges such as 1,3,5,7 to extract odd pages, or 2,4,6,8 for even pages, and each group becomes its own PDF.",
      },
    ],
    relatedSlugs: ["split-pdf", "delete-pdf-pages", "merge-pdf", "reorder-pdf-pages"],
  },
  "reorder-pdf-pages": {
    definition:
      "Reordering PDF pages changes the order of pages in a document. PDFForge lets you reorder PDF pages online for free with simple drag and drop, then saves the rearranged file locally in your browser.",
    features: [
      "Drag and drop to rearrange page order",
      "Visual thumbnail preview of every page",
      "Save your new ordering with one click",
      "No uploads — fully processed on your device",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Open the PDF whose page order you want to change.",
      },
      {
        title: "Drag pages into place",
        description:
          "Use the thumbnails to drag and drop pages into the order you want.",
      },
      {
        title: "Download the reordered file",
        description:
          "PDFForge rebuilds the document in the new order and downloads it instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I change the page order of a PDF?",
        answer:
          "Open the Reorder PDF Pages tool, drag the page thumbnails into your preferred sequence, and click download. The reordered document is saved locally.",
      },
      {
        question: "Can I move multiple pages at the same time?",
        answer:
          "Yes. Select several pages and move them together as a block before downloading the reordered document.",
      },
    ],
    relatedSlugs: ["rotate-pdf", "delete-pdf-pages", "merge-pdf", "extract-pdf-pages"],
  },
  "protect-pdf": {
    definition:
      "Protecting a PDF adds a password using real encryption so only people with the password can open it. PDFForge protects PDFs online for free with genuine AES encryption, processed locally so the password never leaves your device.",
    features: [
      "Password-protect your PDF with real encryption",
      "Optional permissions to restrict printing or copying",
      "The password is processed in memory, never transmitted",
      "Free and unlimited with no watermarks",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the document you want to protect.",
      },
      {
        title: "Set a password",
        description:
          "Type a strong password. Optionally restrict printing or copying with permissions.",
      },
      {
        title: "Download the encrypted PDF",
        description:
          "PDFForge encrypts the file locally in your browser. Only people with the password can open it.",
      },
    ],
    faqs: [
      {
        question: "How secure is password-protecting my PDF?",
        answer:
          "PDFForge applies genuine AES encryption inside your browser. The password and document are processed in memory and never uploaded, so neither is transmitted anywhere.",
      },
      {
        question: "Can I remove a password from a PDF later?",
        answer:
          "Yes. Use the PDFForge Unlock PDF tool with your password to decrypt the file and remove its opening restriction.",
      },
    ],
    relatedSlugs: ["unlock-pdf", "sign-pdf", "watermark-pdf", "compress-pdf"],
  },
  "page-numbers-pdf": {
    definition:
      "Adding page numbers to a PDF stamps numbers onto each page. PDFForge's Page Numbers tool lets you add page numbers to PDF online for free with custom position, margins, typography, and formats.",
    features: [
      "Stamp page numbers on every page automatically",
      "Choose position, margins, and font styling",
      "Select classic or custom numbering formats",
      "Rendered locally in your browser — no uploads",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the document that needs page numbers.",
      },
      {
        title: "Configure the numbering",
        description:
          "Pick where the numbers appear, the margin, font size, color, and starting number.",
      },
      {
        title: "Download the numbered PDF",
        description:
          "PDFForge stamps the numbers and downloads the finished document instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I add page numbers to a PDF for free?",
        answer:
          "Open the Page Numbers tool, upload your PDF, choose a position and style, and download. PDFForge is free, unlimited, and processes everything in your browser.",
      },
      {
        question: "Can I start page numbers from a specific number?",
        answer:
          "Yes. You can set the starting page number, which is useful when a document has a cover page or an earlier section.",
      },
    ],
    relatedSlugs: ["watermark-pdf", "rotate-pdf", "merge-pdf", "compress-pdf"],
  },
  "watermark-pdf": {
    definition:
      "Watermarking a PDF stamps text across every page, usually a logo notice or 'DRAFT' label. PDFForge lets you watermark PDFs online for free with adjustable opacity, angle, and position — all in your browser.",
    features: [
      "Stamp repeating text watermarks on every page",
      "Adjust opacity, angle, and positioning",
      "Useful for DRAFT, CONFIDENTIAL, or branding",
      "Processed locally — your file is never uploaded",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the document that needs a watermark.",
      },
      {
        title: "Enter watermark text and style",
        description:
          "Type the text, then set opacity, angle, font size, and position on the page.",
      },
      {
        title: "Download the watermarked PDF",
        description:
          "PDFForge stamps the watermark across your pages and downloads the result locally.",
      },
    ],
    faqs: [
      {
        question: "Can I put a CONFIDENTIAL watermark on a PDF?",
        answer:
          "Yes. Enter CONFIDENTIAL as the watermark text, set a slight angle and moderate opacity, and every page is stamped automatically in your browser.",
      },
      {
        question: "Can I adjust the watermark transparency?",
        answer:
          "Yes. PDFForge lets you control opacity so the watermark can be subtle or prominent while keeping the underlying content readable.",
      },
    ],
    relatedSlugs: ["sign-pdf", "page-numbers-pdf", "protect-pdf", "rotate-pdf"],
  },
  "sign-pdf": {
    definition:
      "Signing a PDF places your electronic signature onto a document. PDFForge lets you sign PDFs online for free by drawing with mouse or touch, typing in a cursive font, or uploading a signature image.",
    features: [
      "Draw a signature with mouse or touch",
      "Type your name in a cursive signature font",
      "Upload an existing signature image",
      "Place and resize the signature on any page",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Open the document you need to sign.",
      },
      {
        title: "Create your signature",
        description:
          "Draw with your mouse or finger, type your name in a cursive style, or upload a signature image.",
      },
      {
        title: "Place and download",
        description:
          "Position the signature on the signature line, then download your signed PDF locally.",
      },
    ],
    faqs: [
      {
        question: "How can I sign a PDF without printing it?",
        answer:
          "Use the PDFForge Sign PDF tool. Draw, type, or upload your signature and place it directly on the document — completely within the browser and free.",
      },
      {
        question: "Is an electronic signature legally valid?",
        answer:
          "An electronic signature demonstrates the signer's intent and, depending on your jurisdiction and context, can be legally equivalent to a handwritten one. PDFForge creates the signed PDF in your browser.",
      },
    ],
    relatedSlugs: ["protect-pdf", "watermark-pdf", "merge-pdf", "compress-pdf"],
  },
  "webp-to-pdf": {
    definition:
      "WebP to PDF conversion turns modern WebP images into a single organized PDF document. PDFForge converts WebP to PDF online for free with custom margins, orientation, and page size on your device.",
    features: [
      "Convert multiple WebP images into one PDF",
      "Customize margins, orientation, and page size",
      "Reorder images before conversion",
      "Processed entirely in your browser",
    ],
    howTo: [
      {
        title: "Add your WebP images",
        description:
          "Upload one or more WebP pictures. You can reorder them before converting.",
      },
      {
        title: "Set the page layout",
        description:
          "Choose page size, orientation, margins, and how images fit on each page.",
      },
      {
        title: "Create and download the PDF",
        description:
          "PDFForge assembles the PDF locally and downloads it instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I convert WebP images to PDF?",
        answer:
          "Open the WebP to PDF tool, drop in your images, pick your layout settings, and click create. The PDF is generated locally and downloaded in seconds.",
      },
      {
        question: "Why is WebP used instead of JPG?",
        answer:
          "WebP typically compresses images smaller than JPG or PNG at similar quality. PDFForge converts both formats so you can work with whichever your source files use.",
      },
    ],
    relatedSlugs: ["png-to-pdf", "jpg-to-pdf", "pdf-to-png", "pdf-to-jpg"],
  },
  "png-to-pdf": {
    definition:
      "PNG to PDF conversion turns transparent or high-resolution PNG images into clean PDF files. PDFForge converts PNG to PDF online for free, letting you reorder pages and customize the layout locally in your browser.",
    features: [
      "Convert one or many PNG images into a single PDF",
      "Preserves transparency where the PDF supports it",
      "Rearrange images and adjust page settings",
      "No uploads — conversion happens in your browser",
    ],
    howTo: [
      {
        title: "Add your PNG images",
        description:
          "Upload one or more PNG files, then drag them into the desired order.",
      },
      {
        title: "Configure the layout",
        description:
          "Choose page size, orientation, and margins to match how you want the document presented.",
      },
      {
        title: "Download the PDF",
        description:
          "PDFForge renders the PDF from your images locally and downloads it instantly.",
      },
    ],
    faqs: [
      {
        question: "How do I convert PNG images to a single PDF?",
        answer:
          "Open the PNG to PDF tool, add all your images, arrange them, set the layout, and click create. Every image becomes a page in one downloadable PDF.",
      },
      {
        question: "Are PNGs with transparency preserved in the PDF?",
        answer:
          "PDFs support transparency, so translucent elements in your PNGs are rendered accurately without a background box.",
      },
    ],
    relatedSlugs: ["jpg-to-pdf", "webp-to-pdf", "pdf-to-png", "merge-pdf"],
  },
  "pdf-to-png": {
    definition:
      "PDF to PNG conversion exports each PDF page as a crisp, lossless PNG image. PDFForge converts PDF to PNG online for free with selectable resolution and DPI, and lets you download individual pages or a ZIP archive.",
    features: [
      "Export lossless PNG images from PDF pages",
      "Set your preferred DPI and resolution",
      "Download single pages or the full ZIP",
      "Rendered locally — nothing is uploaded",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the PDF you want to export as images.",
      },
      {
        title: "Set resolution",
        description:
          "Choose a DPI/resolution appropriate for screen or print output.",
      },
      {
        title: "Download the PNGs",
        description:
          "Save individual pages or download every page in a single ZIP archive.",
      },
    ],
    faqs: [
      {
        question: "How do I turn a PDF page into a PNG?",
        answer:
          "Open the PDF to PNG tool, upload your file, set the resolution, and download. Each page is rendered as a lossless PNG in your browser.",
      },
      {
        question: "What DPI should I use for printing?",
        answer:
          "300 DPI is the standard for print-quality images. For screen use, 150 DPI or below keeps file sizes smaller while remaining sharp.",
      },
    ],
    relatedSlugs: ["pdf-to-jpg", "pdf-to-text", "png-to-pdf", "compress-pdf"],
  },
  "unlock-pdf": {
    definition:
      "Unlocking a PDF removes password protection and security restrictions from a document you have access to. PDFForge unlocks PDFs online for free by decrypting them locally in your browser using the password you supply.",
    features: [
      "Remove password protection and opening restrictions",
      "Decryption happens in your browser, never on a server",
      "Requires the document password with read access",
      "Free and unlimited downloads",
    ],
    howTo: [
      {
        title: "Upload the protected PDF",
        description:
          "Select the password-protected PDF file you want to unlock. PDFForge will ask for the password.",
      },
      {
        title: "Enter the password",
        description:
          "Type the document password. Processing happens entirely in your browser memory.",
      },
      {
        title: "Download the unlocked PDF",
        description:
          "PDFForge decrypts the file locally and downloads the unlocked document to your device.",
      },
    ],
    faqs: [
      {
        question: "Can PDFForge unlock any password-protected PDF?",
        answer:
          "PDFForge unlocks PDFs when you have the password and read access. It is designed for documents you are entitled to open, and decryption occurs entirely in your browser.",
      },
      {
        question: "Is unlocking a PDF online safe for my files?",
        answer:
          "Yes. The protected document and password are processed in your browser memory and never uploaded. PDFForge operates 100% client-side.",
      },
    ],
    relatedSlugs: ["protect-pdf", "pdf-to-text", "compress-pdf", "merge-pdf"],
  },
  "pdf-to-text": {
    definition:
      "PDF to text extraction pulls the readable text out of a PDF into a clean text document. PDFForge extracts text from PDF online for free with an instant preview, one-click copy, and .txt download.",
    features: [
      "Extract all readable text from a PDF",
      "Instant in-browser preview of the result",
      "Copy results with one click or download as .txt",
      "Everything runs locally on your device",
    ],
    howTo: [
      {
        title: "Upload your PDF",
        description:
          "Add the PDF with the text you want to extract.",
      },
      {
        title: "Preview the extracted text",
        description:
          "Review the plaintext result instantly in your browser and refine what you need.",
      },
      {
        title: "Copy or download",
        description:
          "Copy the text to your clipboard or download it as a .txt file.",
      },
    ],
    faqs: [
      {
        question: "How do I extract text from a scanned PDF?",
        answer:
          "Text extraction reads the text layer in a PDF. Scanned documents that are pure images need OCR first; PDFForge extracts whatever text layer exists in your document.",
      },
      {
        question: "What format is the extracted text?",
        answer:
          "Output is plain text you can copy or download as a .txt file, ready to paste into a document, spreadsheet, or word processor.",
      },
    ],
    relatedSlugs: ["pdf-to-jpg", "pdf-to-png", "split-pdf", "compress-pdf"],
  },
};

export function getToolSeoContent(slug: string): ToolSeoContent | undefined {
  return toolSeoContent[slug];
}