import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

import { legalLinks } from "@/config/site";
import { tools } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { ForgeMark } from "@/components/layout/logo";
import { Reveal } from "@/components/motion/reveal";

export function Footer() {
  const organizeTools = tools.filter(
    (t) => t.category === "organize" || t.category === "compress",
  );
  const convertAndEditTools = tools.filter(
    (t) => t.category === "convert" || t.category === "edit" || t.category === "security",
  );

  return (
    <footer className="relative overflow-hidden border-t bg-card/50">
      {/* Ambient brand wash anchored to the top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bloom-primary-soft opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-pattern-sm opacity-[0.35] mask-fade-b"
      />

      <Container className="relative py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <Reveal className="space-y-4">
            <Link href="/" className="group/logo inline-flex items-center gap-2.5">
              <ForgeMark className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover/logo:scale-110" />
              <span className="text-xl font-bold tracking-tight">
                PDF<span className="font-black text-primary">Forge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your free, aesthetic, and privacy-first PDF utility suite. Every tool
              operates 100% inside your browser — zero files are uploaded to any server.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["No uploads", "No sign-up", "Unlimited"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Column 1: Organize & Optimize */}
          <Reveal delay={80}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Organize &amp; Optimize
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {organizeTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group inline-flex items-center gap-1 transition-colors duration-200 hover:text-primary"
                  >
                    <span>{tool.name}</span>
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Column 2: Convert, Edit & Secure */}
          <Reveal delay={160}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Convert, Edit &amp; Secure
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {convertAndEditTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group inline-flex items-center gap-1 transition-colors duration-200 hover:text-primary"
                  >
                    <span>{tool.name}</span>
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Column 3: Company & Security */}
          <Reveal delay={240}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Company &amp; Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 transition-colors duration-200 hover:text-primary"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/download"
                  className="group inline-flex items-center gap-1 font-medium text-primary"
                >
                  <span>Download Desktop App</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="group inline-flex items-center gap-1 font-medium text-primary"
                >
                  <span>All PDF Tools</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} PDFForge. Crafted with{" "}
            <Heart className="inline size-3 fill-primary text-primary" /> for productivity.
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://acharyanischal.com.np"
              target="_blank"
              rel="noopener"
              className="group/font inline-flex items-center gap-0.5 font-semibold text-foreground transition-colors duration-200 hover:text-primary"
            >
              Nischal Acharya
              <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover/font:translate-x-0.5 group-hover/font:opacity-100" />
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
