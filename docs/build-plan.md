# PDFForge — Phase-Based Implementation Plan

Dependencies: [docs/plan.md](./plan.md) (product spec). This file is the executable build roadmap.
Current state: fresh Next.js 16.3.5 scaffold. No PDF libraries installed. No components built.

## Scope

**In scope (now):** premium, professional PDF tools. All processing client-side in the browser. Homepage + tool pages.
**Out of scope (for now):** sign-in/auth, database, pricing pages, account/history, admin, server-side processing. These are future roadmap only. No database, no Prisma, no auth, no API routes needed.

---

## Phase 0 — Project Foundation

Goal: a clean, buildable base with all dependencies, tooling, and product shell in place.

- [ ] Install dependencies
  - Runtime: `pdf-lib`, `pdfjs-dist`, `react-pdf`, `lucide-react`, `zod`, `jszip`
  - UI: `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot` (+ Radix primitives as needed)
- [ ] Add design tokens to `src/app/globals.css` (CSS variables: background, foreground, accent, border, muted; light/dark/system)
- [ ] Base `src/app/layout.tsx`: site metadata, Geist fonts, header/nav shell, footer, theme toggle
- [ ] Create `.env.example` (only `NEXT_PUBLIC_APP_URL`)
- [ ] Configure `next.config.ts` (webpack `pdfjs-dist` worker handling for client PDF preview)
- [ ] Verify: `npm run lint` passes, `npx tsc --noEmit` passes, `npm run dev` renders product shell

Deliverables: runnable app with global layout, theme tokens, env template.

## Phase 1 — Core Shared Architecture

Goal: every tool reuses one set of components. No per-tool pages yet.

- [ ] Types & constants
  - `src/lib/types.ts`: `FileWithMeta`, `ProcessingStatus` (idle/selected/validating/processing/completed/error), `ToolResult`
  - `src/lib/errors.ts`: typed errors `UnsupportedFileType`, `FileTooLarge`, `InvalidPDF`, `PasswordProtectedPDF`, `ProcessingFailed`, `TooManyPages`, `BrowserProcessingUnavailable`; `toErrorMessage()`
- [ ] Tool registry `src/config/tools.ts`
  - Entry: slug, name, description, category (`organize | convert | compress | edit | security`), icon, supportedExtensions, processingMode (client), available, seoTitle, seoDescription
  - Generates tool cards + navigation
- [ ] Client-side utils
  - `src/lib/files.ts`: read file, size/type validation, duplicate detection, sanitized filename, object-URL management
  - `src/lib/format.ts`: human-readable file size, duration
  - `src/lib/range.ts`: parse page ranges (`1-3, 5, 8-10`) with validation
  - `src/lib/download.ts`: trigger download, ZIP assembly via jszip
- [ ] PDF primitives `src/lib/pdf/`
  - `document.ts`: load PDF bytes with pdf-lib, page count, metadata
  - `merge.ts`, `split.ts`, `rotate.ts`, `deletePages.ts`, `extractPages.ts`, `reorder.ts`, `imagesToPdf.ts`, `pdfToImages.ts` (pure functions, tested)
- [ ] Shared components `src/components/`
  - `ui/*`: button, card, input, select, checkbox, radio, badge, dialog, tooltip, skeleton (shadcn-style)
  - `upload/UploadZone.tsx`: click + drag-drop, multi-file, type/size validation, duplicate detection, keyboard accessible, mobile-friendly, reusable callbacks. Premium look: large dashed drop area, centered icon, "Select files" + "or drop here"
  - `files/FileList.tsx`: icon/thumbnail, name, size, page count, remove, drag handle, progress
  - `pages/PageThumbnails.tsx`: PDF.js rendering, responsive grid, selection, drag reorder, non-drag controls
  - `tool/ToolHeader.tsx`, `ConfigurationPanel.tsx`, `ProcessingState.tsx`, `ResultPanel.tsx`, `ToolPage.tsx` (composes the whole flow)
- [ ] Processing hook `src/lib/use-pdf-tool.ts`: state machine driver (validate → process → result/error), progress messages, memory cleanup
- [ ] Tests: range parsing, file validation, merge, split, delete, extract, rotate, reorder, images→PDF, invalid PDFs

Deliverables: full shared toolkit. All tools become thin configs on top of it.

## Phase 2 — Client-Side Tools (10 core tools)

Goal: real, working tools. Nothing faked. Each is a thin page over the shared toolkit.

- [ ] /tools/merge-pdf — multi-file upload, drag reorder, preview, merge, download
- [ ] /tools/split-pdf — every page separately | custom ranges | extract selected; ZIP for multi-output
- [ ] /tools/delete-pdf-pages — thumbnail selection, "X pages selected", delete, generate
- [ ] /tools/extract-pdf-pages — visual selection or ranges (`1-3, 5, 8-10`)
- [ ] /tools/reorder-pdf-pages — draggable thumbnail grid, "Save reordered PDF"
- [ ] /tools/rotate-pdf — per-page/all, 90° CW, 180°, 90° CCW
- [ ] /tools/jpg-to-pdf — multiple images, reorder, page size, orientation, margin, image fit
- [ ] /tools/pdf-to-jpg — PDF.js render per page, JPG quality setting, ZIP output
- [ ] /tools/compress-pdf — real compression path where possible; after processing show original/compressed size + % saved; honest messaging when a file can't be safely reduced
- [ ] /tools/protect-pdf — password + confirm validation (min length, match); real encryption via pdf-lib is supported and used — never fake
- [ ] /tools page (all tools, grouped by category)
- [ ] Per-tool SEO metadata (title, description, OG, canonical) from registry

Deliverables: 10 working tools routed at /tools/*.

## Phase 3 — Homepage & Polish

Goal: a premium iLovePDF-style front door that showcases the tools.

- [ ] Homepage: hero "Your PDF workspace" + subtitle ("Simple tools for merging, splitting, converting, compressing, and managing PDF files."), prominent upload/quick-tool area, featured tools grid (Merge/Compress/Split/PDF→JPG/JPG→PDF/Rotate/Protect), Why PDFForge, Privacy-focused processing ("The file is processed in your browser."), How it works, FAQ, footer
- [ ] Light/dark/system theme toggle, token-driven
- [ ] Privacy/security: "processed in your browser" labels, size/type validation (never extension-only), sanitized filenames, safe error handling (no stack traces), auto object-URL cleanup
- [ ] SEO: sitemap.ts, robots.ts, per-tool metadata, structured data, semantic headings, internal links
- [ ] Responsive pass at 320 / 375 / 430 / 768 / 1024 / 1440px; no horizontal overflow; bottom action areas on mobile
- [ ] Accessibility: semantic HTML, keyboard nav, visible focus, ARIA, screen-reader status messages, non-drag alternatives for every drag operation
- [ ] Performance: lazy-load pdfjs-dist, code-split tool pages, object-URL cleanup, large-PDF memory guardrails

Deliverables: complete premium site + tool experience, fully responsive and accessible.

## Phase 4 — Quality, Docs, Hardening

Goal: production-ready polish.

- [ ] Unit tests: all core PDF ops + validation + range parsing (invalid PDFs and unsupported files covered)
- [ ] `npm run lint` clean, `npx tsc --noEmit` clean, production build verified
- [ ] Error boundaries + loading/empty states everywhere
- [ ] README: overview, features, tech stack, install, dev commands, processing architecture, security, roadmap
- [ ] Final audit: no fake features, no setTimeout fake processing, honest availability labels, all tools feel premium and consistent

Deliverables: tested, documented, polished production build.

---

## Ordering & Dependency Notes

- Phase 0 → 1 → 2 strictly sequential (shared toolkit unblocks all tools).
- Phase 3 homepage can begin in parallel once Phase 1 components exist.
- Compress stays queue-last in Phase 2 (browser compression is limited — honest messaging required).
- Protect is fully client-side (pdf-lib standard encryption) — legit, not faked.
- Every milestone ends with: `npm run lint` + `tsc --noEmit` + visual check in dev.

## Future Roadmap (deliberately NOT built now)

- Sign-in / accounts (Auth.js), database (Prisma), /account + /history
- Server-side processing for heavy ops (OCR, PDF→Word/Excel/PPT, advanced compression)
- /pricing, /admin dashboard
- PDF editor (/editor) with text/image/drawing/signature