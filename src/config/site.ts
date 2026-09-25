export const siteConfig = {
  name: "PDFForge",
  tagline: "Your PDF workspace",
  description:
    "Simple tools for merging, splitting, converting, compressing, and managing PDF files. Everything runs in your browser.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  twitterImage: "/twitter.png",
  supportEmail: "Nischal060@gmail.com",
  desktop: {
    name: "PDFForge Viewer",
    version: "1.1.0",
    downloadUrl:
      process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL ??
      "https://pdfforge.acharyanischal.com.np/releases/1.1.0/PDFForge-Setup.exe",
    downloadLabel: "PDFForge-Setup.exe",
    releases: [
      {
        version: "1.1.0",
        url: "https://pdfforge.acharyanischal.com.np/releases/1.1.0/PDFForge-Setup.exe",
        label: "PDFForge-Setup.exe",
        size: "123 MB",
        released: "Sep 24, 2026",
        latest: true,
        note: "PDF creation, PDF tabs & split view, print preview, new themes, and Windows default app integration.",
        changes: [
          "Create PDFs from rich text, plain text, and images",
          "Customizable PDF export options",
          "PDF tabs with split / dual-pane viewing",
          "Print preview with page range, copies, orientation & color controls",
          "Clickable email and phone number detection",
          "Unsaved-changes warnings",
          "Windows default PDF app integration with custom file icons",
          "Multiple themes — dark, classic, minimal, and custom",
          "Improved installer branding",
        ],
      },
      {
        version: "1.0.0",
        url: "https://pdfforge.acharyanischal.com.np/releases/1.0.0/PDFForge-Setup.exe",
        label: "PDFForge-Setup.exe",
        size: "119 MB",
        released: "Sep 23, 2026",
        latest: false,
        note: "Initial release with fast, private, offline PDF viewing, zoom, thumbnails, and print.",
        changes: [
          "Fast, private, offline PDF viewing",
          "Zoom, fit-to-width, and keyboard shortcuts",
          "Page thumbnails for visual navigation",
          "System print support",
          "Dark & light themes",
          "One-click .pdf file association",
        ],
      },
    ],
  },
} as const;

export const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
] as const;

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/about", label: "About" },
] as const;