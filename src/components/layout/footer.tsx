import Link from "next/link";

import { legalLinks } from "@/config/site";
import { tools } from "@/config/tools";
import { Container } from "@/components/layout/container";
import { ForgeMark } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <ForgeMark />
              <span className="text-lg font-semibold tracking-tight">
                PDFForge
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Simple tools for merging, splitting, converting, compressing, and
              managing PDF files.
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Files never leave your device.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Tools</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              {tools.slice(0, 6).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="transition-colors hover:text-foreground hover:underline"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  All tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} PDFForge. All rights reserved.
          </p>
          <p>Processed entirely in your browser — nothing is uploaded.</p>
        </div>
      </Container>
    </footer>
  );
}