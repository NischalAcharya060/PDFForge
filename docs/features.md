# PDFForge — Feature Extracts

All features extracted from the original product plan. Organized by area.

## Product Goal

- PDF utility platform: merge, split, convert, compress, manage PDF files
- Drag-and-drop interface
- Fast, responsive, privacy-conscious, accessible, SEO-friendly, mobile-first
- Primary workflow: Tool selection → Upload → Preview/Configure → Process → Result → Download
- No account required for basic PDF operations
- Original premium identity (no copied iLovePDF branding/design)

## Tech Stack

- Next.js App Router, TypeScript (strict), React, Tailwind CSS
- shadcn/ui where useful, Lucide React icons, Geist font
- pdf-lib for client-side PDF manipulation
- PDF.js / react-pdf for previews
- Zod for validation
- Minimal dependencies


## Tools (10 core)

1. **Merge PDF** — select multiple PDFs, drag to reorder, remove, preview, merge, download
2. **Split PDF** — every page separately, custom page ranges (e.g. `1-3, 5, 8-10`), extract selected pages; ZIP for multiple outputs
3. **Compress PDF** — real compression where technically possible; strong / recommended / high-quality levels; shows original size, compressed size, % saved; honest messaging if a file can't be safely reduced
4. **Rotate PDF** — rotate selected or all pages; 90° CW, 180°, 90° CCW
5. **JPG → PDF** — multiple images, reordering, page size, orientation, margin, image fit; client-side
6. **PDF → JPG** — render each page via PDF.js, JPG output (PNG if architecture supports), image quality setting, ZIP for multiple pages
7. **Delete PDF Pages** — page thumbnails, select pages, "X pages selected", delete, generate new PDF
8. **Extract PDF Pages** — visual selection or ranges like `1-3, 5, 8-10`, output PDF of selected pages
9. **Reorder PDF Pages** — draggable thumbnail grid, "Save reordered PDF"
10. **Protect PDF** — password + confirmation validation (required, minimum length, matching), real PDF encryption

Advanced conversion tools (PDF → Word/Excel/PowerPoint, OCR) = architecture placeholders only, never fake.

## Routes

- `/` home
- `/tools` and `/tools/{merge-pdf, split-pdf, compress-pdf, rotate-pdf, jpg-to-pdf, pdf-to-jpg, delete-pdf-pages, extract-pdf-pages, reorder-pdf-pages, protect-pdf}`
- `/editor` (future: shell + viewer architecture, no fake editing)
- `/privacy`, `/terms`, `/about`
- Future architecture only: `/pricing`, `/account`, `/history`, `/admin`, `/api`

## Homepage

- Hero: "Your PDF workspace" / "Simple tools for merging, splitting, converting, compressing, and managing PDF files."
- Obvious main upload/tool area
- Popular tools grid: Merge, Compress, Split, PDF → JPG, JPG → PDF, Rotate, Protect, Edit
- Sections: Popular tools, Why PDFForge, Privacy-focused processing, How it works, FAQ, Footer
- Avoid excessive animation

## Design

- Minimal, premium, modern SaaS/productivity identity
- Strong typography, generous whitespace, subtle borders, restrained shadows
- Light / dark / system modes via CSS variable tokens
- Mobile-first; no excessive gradients, glassmorphism, glowing or 3D effects

## Global Upload Component (UploadZone)

- Click to select, drag-and-drop, multiple files
- File type validation, size validation, duplicate detection
- Upload progress, remove file, clear all
- Keyboard accessible, mobile-friendly
- Exposes reusable callbacks (no tool-specific logic inside)

## Tool Page Architecture

- Reusable structure per tool: ToolHeader → UploadZone → FileList → ConfigurationPanel → ProcessingState → ResultPanel
- Reuse components, never duplicate pages

## File List

- Icon/thumbnail, filename, file size, page count when available
- Remove button, drag handle for reordering
- PDF.js page thumbnails for page-based tools
- Drag-and-drop page reordering

## Processing State Machine

- States: idle, selected, validating, processing, completed, error
- Useful progress messages; never an unexplained spinner

## Result Panel

- Success indicator, output filename, output size, download button
- "Process another file" button, optional delete/cleanup action
- Clear indication when ZIP contains multiple files

## Error Handling

- Typed errors: UnsupportedFileType, FileTooLarge, InvalidPDF, PasswordProtectedPDF, ProcessingFailed, TooManyPages, BrowserProcessingUnavailable
- Human-readable messages; never expose stack traces

## Privacy

- Client-side processing: "The file is processed in your browser."
- Files upload-free for browser tools; no permanent storage by default
- No claims unless the implementation actually delivers

## Security

- Zod validation, file size limits, file type validation (never extension-only)
- Rate limiting abstraction, secure download routes, random job IDs
- No filesystem path exposure, sanitized filenames, safe error handling
- CSRF protection where applicable, auth boundaries for future accounts

## Database (future out-of-scope architecture)

- Prisma schema: `User` (id, email, name, image, plan, createdAt, updatedAt), `Job` (id, userId, tool, status, inputSize, outputSize, createdAt, expiresAt, completedAt), `File` (id, jobId, originalName, storageKey, mimeType, size, pageCount, createdAt)
- `userId` nullable for anonymous processing

## Tool Registry (`config/tools.ts`)

- Fields: slug, name, description, category, icon, supportedExtensions, processingMode, available, seoTitle, seoDescription
- Generates tool cards + navigation
- Categories: organize, convert, compress, edit, security

## SEO

- Unique title, description, Open Graph, canonical per tool page
- Sitemap, robots.txt, semantic headings, internal links, FAQ sections
- No keyword stuffing

## Accessibility

- WCAG-oriented: semantic HTML, keyboard navigation, visible focus, accessible buttons, aria labels
- Sufficient contrast, screen-reader status messages
- Non-drag alternative for every drag operation

## Responsive Design

- Mobile-first; desktop: centered workspace, multi-column, thumbnails, editor-style
- Mobile: single column, large touch targets, bottom action areas, horizontally scrollable thumbnails, no horizontal overflow
- Test ~320, 375, 430, 768, 1024, 1440px

## Editor (future architecture)

- Eventually: text, images, drawing, highlight, underline, shapes, signature, watermark
- Initial: shell + PDF viewer only, no fake editing
- Layout: left toolbar / center canvas / right properties / bottom thumbnails; top toolbar on mobile

## Admin (future architecture)

- Protected `/admin`; dashboard: Users, Jobs, Processing failures, Storage, Tool usage, System health
- Mock-safe empty states, no fake analytics

## Performance

- Fast initial load, code splitting, lazy-load PDF.js + editor
- Efficient thumbnail rendering; object-URL cleanup
- Careful with large PDFs (browser memory)

## Code Quality

- Small reusable components; UI/processing separation; typed interfaces; utility functions
- Server/client boundaries; error boundaries; loading + empty states
- No giant components, no duplicated logic, no fake progress/backends, no hardcoded user data/analytics

## Testing

- At minimum: Merge, Split, Delete pages, Extract pages, Rotate, Reorder, JPG → PDF, file validation, range parsing
- Also invalid PDFs and unsupported files

## Environment Variables

- Placeholders: DATABASE_URL, AUTH_SECRET, STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY, STORAGE_BUCKET, NEXT_PUBLIC_APP_URL
- No real credentials committed

---

## Current Scope Flags

Implemented now (client-side): tools 1–10, homepage, tool pages, privacy labels, security validation, SEO, a11y, responsive, testing.
Future roadmap only: database, auth, pricing, account/history, admin, editor, server-side heavy processing (OCR, conversions, advanced compression).