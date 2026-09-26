"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const quickLinks: { href: string; label: string }[] = [
  { href: "/tools/merge-pdf", label: "Merge PDF" },
  { href: "/tools/split-pdf", label: "Split PDF" },
  { href: "/tools/compress-pdf", label: "Compress PDF" },
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile drawer whenever navigation happens. Adjusting state
  // during render (React's documented "state changes on prop change"
  // pattern) avoids the extra render pass an effect would cost.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  // Tighten and solidify the bar once the page has moved.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-500 ease-[var(--ease-premium)]",
        scrolled
          ? "border-border/80 bg-background/72 shadow-[0_1px_0_0_var(--border),0_10px_30px_-18px_rgb(0_0_0/0.18)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-background/0 backdrop-blur-0",
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between gap-3 transition-all duration-500 ease-[var(--ease-premium)]",
          scrolled ? "h-14" : "h-16",
        )}
      >
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 text-sm font-medium lg:flex"
        >
          {quickLinks.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              data-active={isActive(item.href)}
              className={cn(
                "nav-indicator font-semibold text-foreground/80 transition-colors duration-200 hover:text-foreground",
                isActive(item.href) && "text-primary",
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}

          {/* Convert PDF Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-1 font-semibold text-foreground/80 transition-colors duration-200 hover:text-foreground"
              >
                Convert PDF
                <ChevronDown className="size-3.5 opacity-60 transition-transform duration-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2">
              <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Convert to / from PDF
              </div>
              {convertTools.map((t) => (
                <DropdownMenuItem key={t.slug} asChild>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="group/item flex cursor-pointer items-center gap-2.5"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-[10px] font-bold leading-none text-rose-600 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-rose-500 group-hover/item:text-white dark:text-rose-400">
                      {convertBadge[t.slug] ?? "PDF"}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium transition-colors duration-200 group-hover/item:text-primary">
                        {t.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
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
                className="gap-1.5 font-semibold text-foreground/90 transition-colors duration-200 hover:text-primary"
              >
                <LayoutGrid className="size-4 text-primary" />
                All PDF Tools
                <ChevronDown className="size-3.5 opacity-60 transition-transform duration-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[94vw] max-w-5xl rounded-3xl border bg-card/95 p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="mb-5 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" />
                  </span>
                  <span className="text-sm font-semibold tracking-tight">
                    Every PDF Tool You Need — 100% In-Browser &amp; Private
                  </span>
                </div>
                <Link
                  href="/tools"
                  className="group/browse text-xs font-semibold text-primary"
                >
                  <span className="underline-draw">
                    Browse all catalog
                  </span>
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover/browse:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                {mainCategories.map((cat) => {
                  const catMeta = toolCategories[cat.id];
                  const catTools = tools.filter((t) => t.category === cat.id);
                  if (catTools.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-3">
                      <div className="flex items-center gap-1.5 border-b pb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        {catMeta.label}
                      </div>
                      <div className="space-y-0.5">
                        {catTools.map((t) => {
                          const Icon = t.icon;
                          return (
                            <Link
                              key={t.slug}
                              href={`/tools/${t.slug}`}
                              className="group flex items-center gap-2.5 rounded-xl p-2 text-sm transition-all duration-200 hover:bg-muted/70"
                            >
                              <span
                                className={cn(
                                  "flex size-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
                                  catMeta.iconBgClass,
                                )}
                              >
                                <Icon className="size-3.5" />
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1 truncate text-xs font-medium leading-none text-foreground transition-colors duration-200 group-hover:text-primary">
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
            className="hidden rounded-full font-semibold shadow-premium sm:inline-flex"
          >
            <Link href="/tools">All tools</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden rounded-full font-semibold md:inline-flex"
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
            className="press rounded-full lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="size-5 animate-pop-in" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "overflow-hidden border-b bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 ease-[var(--ease-premium)] lg:hidden",
          mobileOpen
            ? "max-h-[85vh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <div className="max-h-[85vh] overflow-y-auto px-4 py-5">
          <div className="space-y-6">
            <Button asChild className="w-full justify-start rounded-xl font-semibold shadow-premium">
              <Link href="/tools" onClick={() => setMobileOpen(false)}>
                <LayoutGrid className="mr-2 size-4" />
                Explore All {tools.length} PDF Tools
              </Link>
            </Button>

            <Link
              href="/download"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/10 p-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary/45 hover:bg-primary/15"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 transition-transform duration-300 group-hover:scale-110">
                <Download className="size-4" />
              </span>
              Download PDFForge Viewer (Desktop)
            </Link>

            {mainCategories.map((cat) => {
              const catMeta = toolCategories[cat.id];
              const catTools = tools.filter((t) => t.category === cat.id);
              if (catTools.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
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
                          className="flex items-center gap-2 rounded-xl border bg-card p-2.5 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md"
                        >
                          <span
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-md",
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

            <div className="flex flex-col gap-2.5 border-t pt-4 text-sm text-muted-foreground">
              {[
                { href: "/about", label: "About PDFForge" },
                { href: "/privacy", label: "Privacy Guarantee" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-primary"
                >
                  <span>{link.label}</span>
                  <span className="inline-block translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
