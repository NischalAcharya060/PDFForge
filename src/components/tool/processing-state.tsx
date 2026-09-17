"use client";

import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function ProcessingState({ message }: { message: string }) {
  return (
    <div aria-live="polite" aria-busy="true">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
          <div>
            <p className="font-medium">Processing your file</p>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
          <p className="max-w-sm text-xs text-muted-foreground">
            Everything runs locally in your browser. Your file never leaves your
            device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}