import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";

import { getToolBySlug, type ToolDefinition } from "@/config/tools";
import { getToolSeoContent } from "@/config/seo-content";
import { Container } from "@/components/layout/container";

export function ToolSeoContent({ tool }: { tool: ToolDefinition }) {
  const content = getToolSeoContent(tool.slug);
  if (!content) return null;

  const relatedTools = content.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));

  return (
    <Container className="max-w-4xl py-14 sm:py-20">
      <div className="space-y-12">
        {/* Definition block — "What is ...?" answer */}
        <section aria-labelledby={`${tool.slug}-what-is`}>
          <h2 id={`${tool.slug}-what-is`} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What is {tool.name}?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {content.definition}
          </p>
        </section>

        {/* Key features */}
        <section aria-labelledby={`${tool.slug}-features`}>
          <h2 id={`${tool.slug}-features`} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {tool.name} key features
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {content.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 rounded-2xl border bg-card p-4 text-sm leading-relaxed text-muted-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 rounded-xl border bg-emerald-500/5 p-3.5 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Every {tool.name.toLowerCase()} operation runs 100% in your browser — your file never
            leaves your device.
          </p>
        </section>

        {/* How to use */}
        <section aria-labelledby={`${tool.slug}-how-to`}>
          <h2 id={`${tool.slug}-how-to`} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to use {tool.name}
          </h2>
          <ol className="mt-6 space-y-4">
            {content.howTo.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-foreground sm:text-base">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        {content.faqs.length > 0 && (
          <section aria-labelledby={`${tool.slug}-faq`}>
            <h2 id={`${tool.slug}-faq`} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {tool.name} FAQ
            </h2>
            <div className="mt-6 space-y-3">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border bg-card shadow-xs transition-colors"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden sm:p-5">
                    {faq.question}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="shrink-0 transition-transform group-open:rotate-180 text-muted-foreground group-hover:text-primary"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="border-t px-4 pt-3 pb-4 text-xs leading-relaxed text-muted-foreground sm:px-5 sm:text-sm">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <section aria-labelledby={`${tool.slug}-related`} className="pt-8">
            <h2 id={`${tool.slug}-related`} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Related PDF tools
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="rounded-full border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {relatedTool.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}