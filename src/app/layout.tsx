import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
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
    "merge PDF",
    "split PDF",
    "compress PDF",
    "rotate PDF",
    "PDF to JPG",
    "JPG to PDF",
    "PDF to PNG",
    "PNG to PDF",
    "WebP to PDF",
    "PDF to text",
    "add page numbers to PDF",
    "watermark PDF",
    "sign PDF online",
    "protect PDF with password",
    "unlock PDF",
    "delete PDF pages",
    "extract PDF pages",
    "reorder PDF pages",
    "convert PDF",
    "online PDF converter",
    "PDF editor",
    "privacy-first PDF tools",
    "no upload PDF",
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
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Merge, split, compress, convert, watermark, and protect PDF documents — 100% free, unlimited, and processed locally on your device.",
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
      { url: "/favicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
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
        </ThemeProvider>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}