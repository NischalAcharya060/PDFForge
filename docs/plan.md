Build a production-quality web application called **PDFForge**, an original PDF utility platform inspired by the general concept of online PDF tool websites. Do not copy iLovePDF's branding, logo, exact UI, text, illustrations, colors, or proprietary design. Create a distinct premium productivity-focused identity.

## PRODUCT GOAL

PDFForge should allow users to perform common PDF operations through a simple drag-and-drop interface. The application must be fast, responsive, privacy-conscious, accessible, SEO-friendly, and mobile-first.

The primary workflow must always be:

Tool selection → Upload → Preview/Configure → Process → Result → Download.

Do not require an account for basic PDF operations.

## TECH STACK

Use:

* Next.js with App Router
* TypeScript
* React
* Tailwind CSS
* shadcn/ui where useful
* Lucide React icons
* Geist font
* pdf-lib for client-side PDF manipulation where appropriate
* PDF.js/react-pdf or an appropriate PDF.js-based viewer for PDF previews
* Prisma
* PostgreSQL architecture ready for production
* Auth.js architecture for optional authentication
* Zod for validation

Use strict TypeScript. Avoid unnecessary dependencies.

## IMPORTANT ARCHITECTURE PRINCIPLE

Prefer client-side processing whenever technically practical.

Client-side tools should include:

* Merge PDF
* Split PDF
* Delete pages
* Extract pages
* Rotate PDF
* Reorder pages
* JPG → PDF
* PNG → PDF
* Basic PDF page operations

Do not upload these files to the server unnecessarily.

For computationally heavy operations such as advanced compression, OCR, or complex document conversion, create a clean server/worker architecture that can be implemented later.

Do not fake processing. If a feature is not technically implemented, clearly mark it as unavailable or coming soon rather than creating a simulated result.

## INITIAL TOOLS

Implement these first:

1. Merge PDF
2. Split PDF
3. Compress PDF
4. Rotate PDF
5. JPG → PDF
6. PDF → JPG
7. Delete PDF Pages
8. Extract PDF Pages
9. Reorder PDF Pages
10. Protect PDF

Advanced conversion tools such as PDF → Word, PDF → Excel, PDF → PowerPoint, and OCR should have architecture placeholders but should not pretend to work unless a real processing implementation is included.

## ROUTES

Create:

/
/tools
/tools/merge-pdf
/tools/split-pdf
/tools/compress-pdf
/tools/rotate-pdf
/tools/jpg-to-pdf
/tools/pdf-to-jpg
/tools/delete-pdf-pages
/tools/extract-pdf-pages
/tools/reorder-pdf-pages
/tools/protect-pdf
/editor
/pricing
/privacy
/terms
/about

Prepare architecture for:

/account
/history
/admin
/api

## HOMEPAGE

Create a premium, clean homepage.

Hero:

"Your PDF workspace"

Subtitle:

"Simple tools for merging, splitting, converting, compressing, and managing PDF files."

Main upload/tool area should make it immediately obvious what the user can do.

Show popular tools in a responsive grid:

* Merge PDF
* Compress PDF
* Split PDF
* PDF → JPG
* JPG → PDF
* Rotate PDF
* Protect PDF
* Edit PDF

Include sections for:

* Popular PDF tools
* Why PDFForge
* Privacy-focused processing
* How it works
* FAQ
* Footer

Avoid excessive animation.

## DESIGN

Create an original professional visual identity.

Design characteristics:

* Minimal
* Premium
* Modern SaaS/productivity application
* Strong typography
* Generous whitespace
* Subtle borders
* Restrained shadows
* Professional icons
* Smooth but minimal transitions
* Excellent mobile experience

Support:

* Light mode
* Dark mode
* System preference

Use CSS variables/design tokens rather than hardcoding colors throughout components.

Do not use excessive gradients, glassmorphism, glowing effects, giant animated backgrounds, or unnecessary 3D effects.

## GLOBAL UPLOAD COMPONENT

Create a reusable UploadZone component supporting:

* Click to select
* Drag and drop
* Multiple files where applicable
* File type validation
* File size validation
* Duplicate detection where useful
* Upload progress where applicable
* Remove file
* Clear all
* Keyboard accessibility
* Mobile interaction

The component should expose reusable callbacks rather than containing tool-specific processing logic.

## TOOL PAGE ARCHITECTURE

Every tool should use the same reusable structure:

ToolPage
├── ToolHeader
├── UploadZone
├── FileList
├── ConfigurationPanel
├── ProcessingState
└── ResultPanel

Create reusable components rather than duplicating entire pages.

## FILE LIST

Each uploaded file should display:

* File icon/thumbnail
* Filename
* File size
* Page count when available
* Remove button
* Drag handle when reordering is supported

For page-based tools, render page thumbnails using PDF.js.

Allow drag-and-drop page reordering.

## MERGE PDF

Users should be able to:

* Select multiple PDFs
* Drag files to reorder
* Remove files
* Add additional files
* Preview PDFs
* Merge them
* Download the resulting PDF

Use pdf-lib where appropriate.

## SPLIT PDF

Provide:

* Every page separately
* Custom page ranges
* Extract selected pages

For multiple output files, create a ZIP in the browser when practical.

Example:

1-3
5
8-10

should create the corresponding output files.

## DELETE PAGES

Show page thumbnails.

Users can select pages and delete them.

Display:

"3 pages selected"

Provide:

[Delete selected pages]

Then generate the new PDF.

## EXTRACT PAGES

Allow users to select pages visually or enter ranges.

Example:

1-3, 5, 8-10

Generate a new PDF containing only selected pages.

## REORDER PAGES

Display page thumbnails in a responsive grid.

Users should be able to drag pages.

Provide:

[Save reordered PDF]

## ROTATE PDF

Allow:

* Rotate selected pages
* Rotate all pages

Options:

90° clockwise
180°
90° counter-clockwise

## JPG/PNG TO PDF

Support multiple images.

Allow:

* Reordering
* Page size
* Orientation
* Margin
* Image fit

Generate a PDF client-side when possible.

## PDF TO JPG

Render each PDF page through PDF.js.

Allow:

* JPG output
* PNG output if architecture supports it
* Image quality setting

For multiple pages, provide ZIP download.

## COMPRESS PDF

Create a real compression workflow where technically possible.

Provide:

* Strong compression
* Recommended compression
* High quality

Before processing, do not claim a specific file-size reduction.

After processing display:

Original size
Compressed size
Percentage saved

If the browser implementation cannot safely reduce a particular PDF, clearly communicate that instead of returning a fake smaller file.

## PROTECT PDF

Provide password input and confirmation.

Validate:

* Password required
* Minimum length
* Matching confirmation

Use actual PDF encryption if the selected library supports it. If the chosen client-side library cannot reliably implement PDF encryption, do not fake the feature. Create a server-side processing abstraction instead.

## PROCESSING STATE

Use a clear state machine:

idle
selected
validating
processing
completed
error

Display useful progress messages.

Never leave the user with an unexplained loading spinner.

## RESULT PANEL

Display:

* Success indicator
* Output filename
* Output size
* Download button
* Process another file button
* Optional delete/cleanup action

For ZIP results, clearly indicate that multiple files are included.

## ERROR HANDLING

Create typed application errors.

Examples:

* UnsupportedFileType
* FileTooLarge
* InvalidPDF
* PasswordProtectedPDF
* ProcessingFailed
* TooManyPages
* BrowserProcessingUnavailable

Show human-readable messages.

Never expose stack traces to users.

## PRIVACY

Create a privacy-first architecture.

For browser-side processing:

"The file is processed in your browser."

For server-side processing:

* Use temporary storage
* Generate unique job IDs
* Do not expose storage paths
* Delete temporary input/output files automatically
* Add expiration timestamps
* Never permanently store uploaded documents by default

Do not claim that files are deleted instantly unless the implementation actually does so.

## SECURITY

Implement:

* Zod validation
* File size limits
* File type validation
* Rate limiting abstraction
* Secure download routes
* Random job IDs
* No filesystem path exposure
* Sanitized filenames
* Safe error handling
* CSRF protection where applicable
* Authentication boundaries for future account functionality

Never trust file extensions alone.

## DATABASE

Create Prisma schema architecture for:

User
Job
File

User:

id
email
name
image
plan
createdAt
updatedAt

Job:

id
userId
tool
status
inputSize
outputSize
createdAt
expiresAt
completedAt

File:

id
jobId
originalName
storageKey
mimeType
size
pageCount
createdAt

Make userId nullable so anonymous processing remains possible.

## TOOL REGISTRY

Create a central configuration file such as:

config/tools.ts

Each tool should contain:

slug
name
description
category
icon
supportedExtensions
processingMode
available
seoTitle
seoDescription

Generate tool cards and tool navigation from this registry where practical.

Categories:

organize
convert
compress
edit
security

## SEO

Every tool page needs unique:

* title
* description
* Open Graph metadata
* canonical URL
* structured metadata where appropriate

Create:

* sitemap
* robots.txt
* semantic headings
* internal links
* FAQ sections

Do not keyword-stuff pages.

## ACCESSIBILITY

Follow WCAG-oriented practices.

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible buttons
* aria labels where necessary
* sufficient contrast
* screen-reader-friendly status messages
* drag-and-drop alternatives for users who cannot use drag-and-drop

Every drag operation must have a non-drag alternative.

## RESPONSIVE DESIGN

Design mobile-first.

Desktop:

* centered workspace
* multi-column tool layouts
* page thumbnails
* editor-style interface

Mobile:

* single-column layout
* large touch targets
* bottom action areas where useful
* horizontally scrollable page thumbnails
* no horizontal page overflow

Test approximately:

320px
375px
430px
768px
1024px
1440px

## PDF EDITOR ARCHITECTURE

Create the foundation for /editor.

The editor should eventually support:

* Text
* Images
* Drawing
* Highlight
* Underline
* Shapes
* Signature
* Watermark

For the initial version, implement the editor shell and PDF viewer architecture without pretending that advanced editing works.

The editor layout should be:

Desktop:

Left toolbar
Center PDF canvas
Right properties panel
Bottom page thumbnails

Mobile:

Top toolbar
PDF canvas
Bottom tools
Page thumbnails

## ADMIN ARCHITECTURE

Create a protected /admin architecture.

Dashboard should eventually show:

* Users
* Jobs
* Processing failures
* Storage
* Tool usage
* System health

For the first implementation, create the structure and mock-safe empty states rather than fake analytics.

## PERFORMANCE

Optimize for:

* Fast initial page load
* Code splitting
* Lazy loading PDF.js
* Lazy loading editor components
* Avoiding unnecessary client components
* Streaming/server rendering where appropriate
* Efficient thumbnail rendering
* Object URL cleanup
* Memory cleanup after processing

Be especially careful with large PDFs because browser memory can become a bottleneck.

## CODE QUALITY

Use:

* Small reusable components
* Clear separation of UI and processing logic
* Typed interfaces
* Utility functions
* Server/client boundaries
* Error boundaries
* Loading states
* Empty states

Avoid:

* giant components
* duplicated processing code
* unnecessary global state
* arbitrary setTimeout-based fake processing
* fake progress percentages
* fake backend responses
* hardcoded user data
* hardcoded analytics

## TESTING

Create tests for core PDF operations and utility functions.

At minimum test:

* Merge
* Split
* Delete pages
* Extract pages
* Rotate
* Reorder
* JPG → PDF
* File validation
* Range parsing

Also test invalid PDFs and unsupported files.

## README

Create a complete README containing:

* Project overview
* Features
* Tech stack
* Installation
* Environment variables
* Database setup
* Development commands
* Production deployment considerations
* PDF processing architecture
* Security considerations
* Future roadmap

## ENVIRONMENT VARIABLES

Create .env.example.

Include placeholders for:

DATABASE_URL
AUTH_SECRET
STORAGE_ENDPOINT
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
STORAGE_BUCKET
NEXT_PUBLIC_APP_URL

Do not place real credentials in the repository.

## IMPLEMENTATION ORDER

Build in this order:

1. Project foundation
2. Design system
3. Global layout
4. Tool registry
5. Homepage
6. UploadZone
7. Merge PDF
8. Split PDF
9. Delete pages
10. Extract pages
11. Reorder pages
12. Rotate PDF
13. JPG → PDF
14. PDF → JPG
15. Compression architecture
16. Protect PDF architecture
17. Result system
18. Error handling
19. Privacy/security
20. SEO
21. Responsive optimization
22. Testing
23. README

## IMPORTANT DEVELOPMENT RULE

Do not generate the entire project as one giant component.

Build reusable components and modules.

Before implementing a new tool, ask:

"Can this functionality reuse the existing upload, preview, processing, result, validation, and error components?"

If yes, reuse them.

The finished application should feel like a coherent product, not a collection of unrelated demo pages.

The final result should be production-oriented, visually polished, responsive, accessible, and technically honest about which PDF operations are actually implemented.
