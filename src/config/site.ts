export const siteConfig = {
  name: "PDFForge",
  tagline: "Your PDF workspace",
  description:
    "Simple tools for merging, splitting, converting, compressing, and managing PDF files. Everything runs in your browser.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/logo.png",
  supportEmail: "contact@pdfforge.app",
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