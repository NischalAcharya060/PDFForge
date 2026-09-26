"use client";

import { Loader2, Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ProcessingState({ message }: { message: string }) {
  return (
    <div aria-live="polite" aria-busy="true">
      <Card className="surface relative isolate w-full overflow-hidden border shadow-premium-lg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_50%_0%,var(--accent),transparent)] opacity-35"
        />
        <div
          aria-hidden="true"
          className="grid-pattern-sm pointer-events-none absolute inset-0 -z-10 opacity-20 mask-radial-hero"
        />

        <CardContent className="flex flex-col items-center justify-center gap-5 py-14 text-center">
          {/* Progress core */}
          <div className="relative size-20">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
              style={{ animationDuration: "900ms" }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-2 rounded-full bg-primary/10 pulse-ring"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-7 animate-spin text-primary" aria-hidden="true" />
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-lg font-bold tracking-tight text-foreground">
              Processing your file
            </p>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>
          </div>

          {/* Indeterminate progress rail */}
          <div
            aria-hidden="true"
            className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 progress-indeterminate" />
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Everything runs locally in your browser. Your file never leaves your device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
