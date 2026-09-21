import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { PwaRegister } from "@/components/pwa/pwa-register";
import {
  ThemeInitScript,
  ThemeProvider,
} from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s`,
  },
  description:
    "Free online PDF tools: merge, split, compress, convert, rotate, watermark, protect & sign PDF files. 100% private — every file is processed locally in your browser and never uploaded.",
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: [
    "PDF tools",
    "free PDF tools",
    "online PDF tools",
    "merge PDF",
    "merge PDF online",
    "combine PDF",
    "join PDF files",
    "split PDF",
    "split PDF online",
    "separate PDF pages",
    "compress PDF",
    "compress PDF online",
    "reduce PDF size",
    "shrink PDF file size",
    "convert PDF to JPG",
    "JPG to PDF",
    "PDF to JPG",
    "PDF to PNG",
    "PNG to PDF",
    "WebP to PDF",
    "PDF to WebP",
    "PDF to text",
    "extract PDF text",
    "PDF to Word online",
    "Word to PDF online",
    "PDF to Excel online",
    "rotate PDF",
    "rotate PDF pages",
    "add page numbers to PDF",
    "PDF page numbers",
    "watermark PDF",
    "add watermark to PDF",
    "image watermark PDF",
    "text watermark PDF",
    "sign PDF online",
    "electronic signature",
    "escalar PDF",
    "authenticate PDF",
    "protect PDF with password",
    "password protect PDF",
    "lock PDF",
    "unlock PDF",
    "remove PDF password",
    "delete PDF pages",
    "remove pages from PDF",
    "extract PDF pages",
    "crop PDF pages",
    "reorder PDF pages",
    "organize PDF pages",
    "convert PDF",
    "online PDF converter",
    "PDF to image",
    "image to PDF",
    "PDF tools online free",
    "best free PDF tools",
    "PDF editor",
    "underline PDF",
    "stamp PDF",
    "PDF form filler",
    "no upload PDF",
    "local PDF processing",
    "private PDF tool",
    "secure PDF tools",
    "browser-based PDF tools",
    "privacy-first PDF tools",
    "PDF merge split compress",

    "pdf",
    "pdf tools",
    "online tool",
    "document",
    "pdf converter",
    "pdf merger",
    "pdf splitter",
    "pdf compressor",
    "pdf rotator",
    "pdf watermarker",
    "pdf signer",
    "pdf protector",
    "pdf unlocker",
    "delete pages from pdf",
    "extract pages from pdf",
    "reorder pdf pages",
    "add page numbers to pdf",
    "pdf to jpg converter",
    "jpg to pdf converter",
    "pdf to png converter",
    "png to pdf converter",
    "webp to pdf converter",
    "pdf to text converter",
    "convert pdf to word",
    "convert word to pdf",
    "convert pdf to excel",
    "sign pdf online free",
    "add watermark to pdf free",
    "password protect pdf online",

    "PDF tools Nepal",
    "Nepal PDF tools",
    "PDF tools in Nepal",
    "free PDF tools Nepal",
    "Nepali PDF converter",
    "PDF merge Nepal",
    "PDF ko tools",
    "PDF merge Nepali",
    "PDF compress Nepal",
    "PDF sign Nepal",
    "Nepal online PDF tools",
    "Kathmandu PDF tools",
    "PDF tools in Nepali",
    "Nepali PDF editor",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Merge, split, compress, convert, watermark, and protect PDF documents — 100% free, unlimited, and processed locally on your device.",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Merge, split, compress, convert, watermark, and protect PDF documents — 100% free, unlimited, and processed locally on your device.",
    images: [siteConfig.twitterImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon/maskable-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "PDFForge",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <PwaRegister />
        </ThemeProvider>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}