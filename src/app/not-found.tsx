import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { tools } from "@/config/tools";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-25 mask-radial-hero"
      />
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 -z-10 rounded-full bloom-primary-soft"
      />

      <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center sm:py-32">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" />
            PAGE NOT FOUND
          </span>
        </Reveal>

        <Reveal delay={80}>
          <p className="animate-fade-up mt-6 text-7xl font-black tracking-tight text-gradient sm:text-8xl">
            404
          </p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            This page isn&apos;t in the forge
          </h1>
          <p className="mx-auto mt-3 max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Try one of our
            tools instead.
          </p>
        </Reveal>

        <Reveal delay={160} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="xl"
            asChild
            className="press group/btn w-full gap-2 rounded-2xl px-8 font-bold shadow-premium-lg sm:w-auto"
          >
            <Link href="/tools">
              Browse all tools
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button
            size="xl"
            variant="outline"
            asChild
            className="press w-full gap-2 rounded-2xl border-border/80 bg-card/60 px-8 font-semibold backdrop-blur-sm hover:bg-card/90 sm:w-auto"
          >
            <Link href="/">
              <Compass className="size-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={240} className="mt-12 w-full max-w-md">
          <Spotlight className="lift border-gradient-hover flex items-center gap-3 rounded-2xl border border-border/80 bg-card/80 p-4 text-left shadow-xs backdrop-blur-sm">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="size-5" aria-hidden="true" />
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Looking for a specific operation? All {tools.length} PDF tools run locally in your
              browser — nothing is ever uploaded.
            </p>
          </Spotlight>
        </Reveal>
      </Container>
    </section>
  );
}
