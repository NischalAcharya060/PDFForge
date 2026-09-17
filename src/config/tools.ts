import type { LucideIcon } from "lucide-react";
import {
  Combine,
  FileImage,
  FileOutput,
  Image,
  ListOrdered,
  Lock,
  RotateCw,
  Scissors,
  Trash2,
  ArrowDownUp,
  Hash,
  Stamp,
} from "lucide-react";

export type ToolCategory = "organize" | "convert" | "compress" | "edit" | "security";

export type ProcessingMode = "client" | "server";

export interface ToolCategoryMeta {
  label: string;
  description: string;
  badgeClass: string;
  iconBgClass: string;
  accentBorder: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  supportedExtensions: string[];
  processingMode: ProcessingMode;
  available: boolean;
  seoTitle: string;
  seoDescription: string;
  badgeText?: string;
}

export const toolCategories: Record<ToolCategory, ToolCategoryMeta> = {
  organize: {
    label: "Organize PDF",
    description: "Merge, split, remove, extract, and reorder your documents.",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
    accentBorder: "hover:border-amber-500/40",
  },
  compress: {
    label: "Compress PDF",
    description: "Reduce file size while keeping visual fidelity.",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
    accentBorder: "hover:border-emerald-500/40",
  },
  convert: {
    label: "Convert PDF",
    description: "Turn images and PDFs into versatile formats.",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white",
    accentBorder: "hover:border-rose-500/40",
  },
  edit: {
    label: "Edit PDF",
    description: "Rotate, stamp page numbers, or add watermarks.",
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    iconBgClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white",
    accentBorder: "hover:border-sky-500/40",
  },
  security: {
    label: "PDF Security",
    description: "Protect and encrypt your documents with passwords.",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    iconBgClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white",
    accentBorder: "hover:border-violet-500/40",
  },
};

export const tools: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortName: "Merge",
    description: "Combine multiple PDFs into one file in the order you want.",
    category: "organize",
    icon: Combine,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Merge PDF — Combine PDF Files Online for Free | PDFForge",
    seoDescription:
      "Merge multiple PDF files into one document. Drag to reorder, then combine — all in your browser, no upload required.",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortName: "Split",
    description: "Separate pages into individual PDFs or custom ranges.",
    category: "organize",
    icon: Scissors,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Split PDF — Separate Pages into Multiple Files | PDFForge",
    seoDescription:
      "Split any PDF into single pages or custom ranges. Download pages as one ZIP file, processed entirely in your browser.",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortName: "Compress",
    description: "Reduce file size while keeping quality where possible.",
    category: "compress",
    icon: ArrowDownUp,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Compress PDF — Reduce PDF File Size Online | PDFForge",
    seoDescription:
      "Compress PDF files to a smaller size. See exactly how much you saved before you download.",
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortName: "Rotate",
    description: "Rotate all pages or individual pages by 90 or 180 degrees.",
    category: "edit",
    icon: RotateCw,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Rotate PDF — Rotate Pages 90° or 180° Online | PDFForge",
    seoDescription:
      "Rotate PDF pages clockwise, counter-clockwise, or 180 degrees. Works on all pages or just the ones you choose.",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortName: "JPG → PDF",
    description: "Convert images to a single PDF, laid out exactly how you want.",
    category: "convert",
    icon: Image,
    supportedExtensions: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ],
    processingMode: "client",
    available: true,
    seoTitle: "JPG to PDF — Convert Images to PDF Online | PDFForge",
    seoDescription:
      "Convert JPG, PNG, and WebP images into a single PDF. Set page size, orientation, margin, and image fit in your browser.",
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    shortName: "PDF → JPG",
    description: "Convert PDF pages into high-quality JPG images.",
    category: "convert",
    icon: FileImage,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "PDF to JPG — Convert PDF Pages to Images | PDFForge",
    seoDescription:
      "Turn PDF pages into JPG images with adjustable quality. Download every page as a ZIP, processed locally in your browser.",
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    shortName: "Delete Pages",
    description: "Remove unwanted pages from your document.",
    category: "organize",
    icon: Trash2,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Delete PDF Pages — Remove Pages from PDF | PDFForge",
    seoDescription:
      "Delete unwanted pages from any PDF visually. Pick the pages you want to remove and download the result instantly.",
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    shortName: "Extract Pages",
    description: "Pull selected pages into a brand-new PDF.",
    category: "organize",
    icon: FileOutput,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Extract PDF Pages — Create a New PDF from Selected Pages | PDFForge",
    seoDescription:
      "Extract specific pages from a PDF and keep only what you need. Select pages visually or with ranges like 1-3, 5, 8-10.",
  },
  {
    slug: "reorder-pdf-pages",
    name: "Reorder PDF Pages",
    shortName: "Reorder",
    description: "Arrange pages in a new order with simple drag and drop.",
    category: "organize",
    icon: ListOrdered,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Reorder PDF Pages — Organize Page Order Online | PDFForge",
    seoDescription:
      "Reorder PDF pages with drag and drop. Save your reordered document with one click — all on your device.",
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    shortName: "Protect",
    description: "Add a password to keep your document private.",
    category: "security",
    icon: Lock,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    seoTitle: "Protect PDF — Add a Password to Your PDF | PDFForge",
    seoDescription:
      "Password-protect your PDF with real encryption. Files are protected locally in your browser and never uploaded.",
  },
  {
    slug: "page-numbers-pdf",
    name: "Page Numbers",
    shortName: "Page Numbers",
    description: "Add page numbers into PDF documents with custom position and format.",
    category: "edit",
    icon: Hash,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    badgeText: "NEW",
    seoTitle: "Add Page Numbers to PDF — Number PDF Pages Online | PDFForge",
    seoDescription:
      "Stamp page numbers on PDF files easily. Choose positions, margins, typography, and page formats.",
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    shortName: "Watermark",
    description: "Stamp text watermarks across PDF pages with custom angle and opacity.",
    category: "edit",
    icon: Stamp,
    supportedExtensions: ["application/pdf"],
    processingMode: "client",
    available: true,
    badgeText: "NEW",
    seoTitle: "Watermark PDF — Stamp Text on PDF Online | PDFForge",
    seoDescription:
      "Stamp custom text watermarks on your PDF pages with adjustable opacity, angle, and position in your browser.",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}

export const popularTools: ToolDefinition[] = [
  getToolBySlug("merge-pdf"),
  getToolBySlug("split-pdf"),
  getToolBySlug("compress-pdf"),
  getToolBySlug("pdf-to-jpg"),
  getToolBySlug("jpg-to-pdf"),
  getToolBySlug("page-numbers-pdf"),
  getToolBySlug("watermark-pdf"),
  getToolBySlug("rotate-pdf"),
  getToolBySlug("protect-pdf"),
].filter((tool): tool is ToolDefinition => Boolean(tool));