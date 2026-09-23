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
    version: "1.0.0",
    downloadUrl:
      process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL ??
      "https://github.com/NischalAcharya060/PDFForge-Viewer/releases/download/v1.0.0/PDFForge-Setup.exe",
    downloadLabel: "PDFForge-Setup.exe",
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