"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Download,
  LayoutGrid,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

import { tools, toolCategories, type ToolCategory } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const mainCategories: { id: ToolCategory; label: string }[] = [
  { id: "organize", label: "Organize PDF" },
  { id: "compress", label: "Optimize PDF" },
  { id: "convert", label: "Convert PDF" },
  { id: "edit", label: "Edit PDF" },
  { id: "security", label: "PDF Security" },
];

const convertTools = tools.filter((tool) => tool.category === "convert");

const convertBadge: Record<string, string> = {
  "jpg-to-pdf": "JPG",
  "png-to-pdf": "PNG",
  "webp-to-pdf": "WebP",
  "pdf-to-jpg": "PDF",
  "pdf-to-png": "PDF",
  "pdf-to-text": "PDF",
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-0.5 text-sm font-medium"
        >
          <Button
            variant="ghost"
            asChild
            className="text-foreground/80 hover:text-foreground font-semibold"
          >
            <Link href="/tools/merge-pdf">Merge PDF</Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="text-foreground/80 hover:text-foreground font-semibold"
          >
            <Link href="/tools/split-pdf">Split PDF</Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="text-foreground/80 hover:text-foreground font-semibold"
          >
            <Link href="/tools/compress-pdf">Compress PDF</Link>
          </Button>

          {/* Convert PDF Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-1 text-foreground/80 hover:text-foreground font-semibold"
              >
                Convert PDF
                <ChevronDown className="size-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 shadow-xl">
              <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Convert to / from PDF
              </div>
              {convertTools.map((t) => (
                <DropdownMenuItem key={t.slug} asChild>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="flex items-center gap-2.5 py-2 cursor-pointer"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 text-[10px] font-bold leading-none">
                      {convertBadge[t.slug] ?? "PDF"}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {t.description}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* All PDF Tools Mega-Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-1.5 text-foreground/90 hover:text-primary font-semibold"
              >
                <LayoutGrid className="size-4 text-primary" />
                All PDF Tools
                <ChevronDown className="size-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[94vw] max-w-5xl p-6 shadow-2xl rounded-2xl border bg-card/95 backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-sm font-semibold tracking-tight">
                    Every PDF Tool You Need — 100% In-Browser & Private
                  </span>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Browse all catalog →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {mainCategories.map((cat) => {
                  const catMeta = toolCategories[cat.id];
                  const catTools = tools.filter((t) => t.category === cat.id);
                  if (catTools.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-1 border-b">
                        {catMeta.label}
                      </div>
                      <div className="space-y-1">
                        {catTools.map((t) => {
                          const Icon = t.icon;
                          return (
                            <Link
                              key={t.slug}
                              href={`/tools/${t.slug}`}
                              className="group flex items-center gap-2.5 rounded-lg p-2 text-sm transition-colors hover:bg-muted/70"
                            >
                              <span
                                className={cn(
                                  "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
                                  catMeta.iconBgClass,
                                )}
                              >
                                <Icon className="size-3.5" />
                              </span>
                              <div className="min-w-0">
                                <div className="font-medium text-xs leading-none text-foreground group-hover:text-primary transition-colors truncate flex items-center gap-1">
                                  {t.shortName}
                                  {t.badgeText ? (
                                    <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-bold text-primary">
                                      {t.badgeText}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Action & Theme */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
          >
            <Link href="/tools">All tools</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden md:inline-flex font-semibold shadow-xs"
          >
            <Link href="/download">
              <Download className="size-3.5" />
              Download
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-5 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full justify-start font-semibold">
                <Link href="/tools" onClick={() => setMobileOpen(false)}>
                  <LayoutGrid className="mr-2 size-4" />
                  Explore All {tools.length} PDF Tools
                </Link>
              </Button>
            </div>

            <div className="space-y-5">
              <Link
                href="/download"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <Download className="size-4" />
                Download PDFForge Viewer (Desktop)
              </Link>
            </div>

            <div className="space-y-5">
              {mainCategories.map((cat) => {
                const catMeta = toolCategories[cat.id];
                const catTools = tools.filter((t) => t.category === cat.id);
                if (catTools.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {catMeta.label}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {catTools.map((t) => {
                        const Icon = t.icon;
                        return (
                          <Link
                            key={t.slug}
                            href={`/tools/${t.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-lg border bg-card p-2.5 text-xs font-medium shadow-xs hover:border-primary/50"
                          >
                            <span
                              className={cn(
                                "flex size-6 shrink-0 items-center justify-center rounded",
                                catMeta.iconBgClass,
                              )}
                            >
                              <Icon className="size-3" />
                            </span>
                            <span className="truncate">{t.shortName}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="hover:text-foreground"
              >
                About PDFForge
              </Link>
              <Link
                href="/privacy"
                onClick={() => setMobileOpen(false)}
                className="hover:text-foreground"
              >
                Privacy Guarantee
              </Link>
              <Link
                href="/terms"
                onClick={() => setMobileOpen(false)}
                className="hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}