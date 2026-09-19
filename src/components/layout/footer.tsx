import Link from "next/link";
import { Heart } from "lucide-react";

import { legalLinks } from "@/config/site";
import { tools } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { ForgeMark } from "@/components/layout/logo";

export function Footer() {
  const organizeTools = tools.filter(
    (t) => t.category === "organize" || t.category === "compress",
  );
  const convertAndEditTools = tools.filter(
    (t) => t.category === "convert" || t.category === "edit" || t.category === "security",
  );

  return (
    <footer className="border-t bg-card/60 backdrop-blur-sm">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <ForgeMark />
              <span className="text-xl font-bold tracking-tight">
                PDF<span className="text-primary font-black">Forge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your free, aesthetic, and privacy-first PDF utility suite. Every tool
              operates 100% inside your browser — zero files are uploaded to any server.
            </p>
          </div>

          {/* Column 1: Organize & Optimize */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Organize & Optimize
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {organizeTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Convert, Edit & Secure */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Convert, Edit & Secure
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {convertAndEditTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Security */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Company & Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="font-medium text-primary hover:underline"
                >
                  All PDF Tools →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} PDFForge. Crafted with{" "}
            <Heart className="size-3 text-primary fill-primary inline" /> for productivity.
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://acharyanischal.com.np"
              target="_blank"
              rel="noopener"
              className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
            >
              Nischal Acharya
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}